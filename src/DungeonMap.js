// Constants
const CONFIG = {
	ORIGINAL_IMAGE_WIDTH: 13458,
	ORIGINAL_IMAGE_HEIGHT: 6961,
	MAX_ZOOM: 5,
	IS_DEBUG: false,
	TILE_SIZE: 256, // Added constant for tile size
};

// Main Map Class
class CustomMap {
	constructor(mapElementId) {
		this.mapElementId = mapElementId;
		this.exportButton = null;
		this.annotationService = new AnnotationService(this.map);
		this.init();
	}

	init() {
		this.map = this._initializeMap();
		this.bounds = this._calculateBounds();
		this.noteLayer = L.layerGroup().addTo(this.map);
		this.coordinatesDiv = document.getElementById('coordinates');

		this._setBoundsAndFit();
		this._initializeEventListeners();

		this.map.whenReady(() => {
			this._createExportButton();
			this.addTileLayer();
		});
	}

	_initializeMap() {
		const mapElement = document.getElementById(this.mapElementId);
		if (!mapElement) {
			throw new Error(`Map element with ID '${this.mapElementId}' not found`);
		}

		return L.map(this.mapElementId, {
			crs: L.CRS.Simple,
			minZoom: 0,
			maxZoom: CONFIG.MAX_ZOOM,
			zoomSnap: 1,
		});
	}

	_calculateBounds() {
		return new L.LatLngBounds(this.map.unproject([0, CONFIG.ORIGINAL_IMAGE_HEIGHT], CONFIG.MAX_ZOOM), this.map.unproject([CONFIG.ORIGINAL_IMAGE_WIDTH, 0], CONFIG.MAX_ZOOM));
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

	addTileLayer() {
		const customTileLayer = new CustomTileLayer('tiles/{z}/{x}_{y}.png', {
			minZoom: 0,
			maxZoom: CONFIG.MAX_ZOOM,
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

			// Add zoom level options
			for (let i = 0; i <= CONFIG.MAX_ZOOM; i++) {
				const option = L.DomUtil.create('option', '', zoomSelect);
				option.value = i;
				option.text = `Zoom ${i + 1}`;
			}

			// Set default value to max zoom
			zoomSelect.value = CONFIG.MAX_ZOOM;

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
		const scale = Math.pow(2, CONFIG.MAX_ZOOM - exportZoom);
		const canvas = document.createElement('canvas');
		canvas.width = CONFIG.ORIGINAL_IMAGE_WIDTH / scale;
		canvas.height = CONFIG.ORIGINAL_IMAGE_HEIGHT / scale;
		const ctx = canvas.getContext('2d');

		const tileSize = CONFIG.TILE_SIZE;
		const tilesX = Math.ceil(canvas.width / tileSize);
		const tilesY = Math.ceil(canvas.height / tileSize);

		let loadedTiles = 0;
		const markers = this.annotationService.getMarkers(this.map);

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {
				try {
					const tile = await this._loadTile(x, y, exportZoom);
					ctx.drawImage(tile, x * tileSize, y * tileSize);
					loadedTiles++;
					exportModal.show(`Exporting map... ${((loadedTiles / (tilesX * tilesY)) * 100).toFixed(2)}% complete`);
				} catch (error) {
					console.error(`Failed to load tile at x: ${x}, y: ${y}`, error);
				}
			}
		}

		// Render all markers after all tiles have been drawn
		await Promise.all(
			markers.map(async (marker, index) => {
				console.log(`Rendering marker ${index + 1}/${markers.length}`);
				try {
					await this._renderCustomMarker(ctx, marker, 1 / scale, exportZoom);
				} catch (error) {
					console.error(`Failed to render marker ${index + 1}:`, error);
				}
			})
		);

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

	async _loadTile(x, y, z) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = `tiles/${z}/${x}_${y}.png`;
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
		// Convert to JPEG and compress
		canvas.toBlob(
			(blob) => {
				const link = document.createElement('a');
				const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
				link.download = `dnd-campaign-map_${timestamp}.jpg`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			},
			'image/jpeg',
			0.9
		); // 0.8 is the quality, adjust as needed
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
