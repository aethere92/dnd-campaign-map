// Constants
const CONFIG = {
	TILE_SIZE: 256,
	IS_DEBUG: false,
};

// Main Map Class
class CustomMap {
	constructor(mapElementId, initialMapKey = 'main') {
		this.mapElementId = mapElementId;
		this.exportButton = null;
		this.currentMapKey = null;
		this.annotationService = null;
		this.loadingIndicator = this._createLoadingIndicator();

		window.customMap = this;
		this.init(initialMapKey);
	}

	async init(mapKey) {
		try {
			this.map = this._initializeMap();
			this.annotationService = new AnnotationService(this.map);
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
		if (!MAP_DATABASE[mapKey]) {
			console.error(`Map key '${mapKey}' not found in MAP_DATABASE`);
			return;
		}

		const mapButton = L.control({ position });
		mapButton.onAdd = () => {
			const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
			const button = L.DomUtil.create('button', 'leaflet-control-custom', container);
			button.innerHTML = customLabel || mapKey.replace(/_/g, ' ');
			button.style.cssText = 'background-color: white; padding: 5px 10px; cursor: pointer; border: none; border-radius: 0.25rem; font-family: system-ui;';

			L.DomEvent.on(button, 'click', () => this.loadMap(mapKey));
			L.DomEvent.disableClickPropagation(container);

			return container;
		};
		mapButton.addTo(this.map);
	}

	async loadMap(mapKey) {
		if (!MAP_DATABASE[mapKey]) {
			throw new Error(`Map key '${mapKey}' not found in MAP_DATABASE`);
		}

		const mapConfig = MAP_DATABASE[mapKey];
		this.currentMapKey = mapKey;

		try {
			this._showLoadingIndicator();

			// Clear existing layers and controls
			this.map.eachLayer((layer) => this.map.removeLayer(layer));
			this._removeAllControls();

			// Update map zoom settings
			this.map.setMaxZoom(mapConfig.maxZoom);

			// Initialize dimensions and update bounds
			await this._initializeMapDimensions(mapConfig);
			this.bounds = this._calculateBounds(mapConfig);
			this._setBoundsAndFit();

			// Add new tile layer
			this.addTileLayer(mapConfig);

			// Add back-to-main button if not on main map
			if (mapKey !== 'main') {
				this.addMapButton('main', 'topleft', 'Back to Main Map');
			}

			// Add annotations if they exist for this map
			if (mapConfig.annotations) {
				this.annotationService.addAnnotations(mapConfig.annotations);
			}

			this._setMapColor(mapConfig);

			// Recreate export button
			this._createExportButton();

			// Set default zoom to half the maximum
			this.map.setZoom(Math?.floor(mapConfig?.maxZoom / 2) ?? 1);
		} catch (error) {
			console.error('Error loading map:', error);
		} finally {
			this._hideLoadingIndicator();
		}
	}

	_setMapColor(config) {
		const map = document.getElementById('map');
		if (!config.backgroundColor) map.style.background = '#e7dabb';
		else map.style.background = config.backgroundColor;
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
			const z = mapConfig.maxZoom;

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
		return new L.LatLngBounds(this.map.unproject([0, mapConfig.imageHeight], mapConfig.maxZoom), this.map.unproject([mapConfig.imageWidth, 0], mapConfig.maxZoom));
	}

	_setBoundsAndFit() {
		this.map.setMaxBounds(this.bounds).fitBounds(this.bounds);
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
		const customTileLayer = new CustomTileLayer(`${mapConfig.path}/{z}/{x}_{y}.png`, {
			minZoom: 0,
			maxZoom: mapConfig.maxZoom,
			noWrap: true,
			bounds: this.bounds,
			attribution: "A quest, a questin' we shall go",
		});

		customTileLayer.addTo(this.map);
	}

	async _handleDebugClick(e) {
		const label = prompt('Please enter a label for this location:');
		if (label === null) return;

		const { shiftKey } = e.originalEvent;
		const output = JSON.stringify({
			lat: e.latlng.lat,
			lng: e.latlng.lng,
			label,
			type: shiftKey ? 'people' : 'place',
			icon: shiftKey ? 'user' : 'mapPin',
		});

		console.log(output);
		try {
			await navigator.clipboard.writeText(output);
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
			button.style.cssText = 'background-color: white; padding: 5px 10px; cursor: pointer; display: block; margin-bottom: 5px; border: none; border-radius: 0.25rem; font-family: system-ui;';

			const zoomSelect = L.DomUtil.create('select', 'leaflet-control-custom', container);
			zoomSelect.style.cssText = 'display: block; width: 100%; padding: 5px; border: none; border-radius: 0.25rem; color: black; font-family: system-ui';

			// Add zoom level options based on current map config
			const currentMapConfig = MAP_DATABASE[this.currentMapKey];
			for (let i = 0; i <= currentMapConfig.maxZoom; i++) {
				const option = L.DomUtil.create('option', '', zoomSelect);
				option.value = i;
				option.text = `Zoom ${i + 1}`;
			}

			// Set default value to max zoom
			zoomSelect.value = currentMapConfig.maxZoom;

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
			const currentMapConfig = MAP_DATABASE[this.currentMapKey];
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
		const currentMapConfig = MAP_DATABASE[this.currentMapKey];
		const scale = Math.pow(2, currentMapConfig.maxZoom - exportZoom);
		const canvas = document.createElement('canvas');
		canvas.width = currentMapConfig.imageWidth / scale;
		canvas.height = currentMapConfig.imageHeight / scale;
		const ctx = canvas.getContext('2d');

		const tileSize = CONFIG.TILE_SIZE;
		const tilesX = Math.ceil(canvas.width / tileSize);
		const tilesY = Math.ceil(canvas.height / tileSize);

		let loadedTiles = 0;
		const totalTiles = tilesX * tilesY;

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {
				try {
					const tile = await this._loadTile(x, y, exportZoom, currentMapConfig.path);
					ctx.drawImage(tile, x * tileSize, y * tileSize);
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
						await this._renderCustomMarker(ctx, marker, 1 / scale, exportZoom);
					} catch (error) {
						console.error(`Failed to render marker ${index + 1}:`, error);
					}
				})
			);
		}

		return canvas;
	}

	async _renderCustomMarker(ctx, marker, scale = 1, exportZoom) {
		const markerLatLng = marker.getLatLng();
		const point = this.map.project(markerLatLng, exportZoom);

		const x = Math.round(point.x);
		const y = Math.round(point.y);

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

	// _downloadImage(canvas) {
	// 	const link = document.createElement('a');
	// 	const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
	// 	link.download = `dnd-campaign-map_${timestamp}.png`;
	// 	link.href = canvas.toDataURL('image/png');
	// 	link.click();
	// }

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

	_testMarkerPositioning() {
		// Create a test canvas with the same dimensions as your image
		const canvas = document.createElement('canvas');
		canvas.width = CONFIG.ORIGINAL_IMAGE_WIDTH;
		canvas.height = CONFIG.ORIGINAL_IMAGE_HEIGHT;
		const ctx = canvas.getContext('2d');

		// Draw a grid for reference
		ctx.strokeStyle = '#ddd';
		for (let x = 0; x < canvas.width; x += 256) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}
		for (let y = 0; y < canvas.height; y += 256) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}

		// Get all markers
		const markers = this.annotationService.getMarkers(this.map);

		// Draw each marker position
		markers.forEach((marker, index) => {
			const markerLatLng = marker.getLatLng();
			const point = this.map.project(markerLatLng, CONFIG.MAX_ZOOM);

			// Draw a point for each marker
			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
			ctx.fill();

			// Label the point
			ctx.fillStyle = 'black';
			ctx.font = '12px Arial';
			ctx.fillText(`Marker ${index + 1}`, point.x + 6, point.y);

			console.log(`Marker ${index + 1}: LatLng(${markerLatLng.lat}, ${markerLatLng.lng}) -> Pixel(${point.x}, ${point.y})`);
		});

		// Open the canvas in a new window
		const dataUrl = canvas.toDataURL();
		const win = window.open();
		win.document.write(`<img src="${dataUrl}" />`);
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

L.Control.prototype.setPosition('center');
