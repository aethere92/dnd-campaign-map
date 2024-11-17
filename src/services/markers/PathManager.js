class PathManager {
	constructor(map, isDebugMode) {
		this.map = map;
		this.paths = [];
		this.isDebugMode = isDebugMode;
		this.pathMasterGroup = L.layerGroup();
		this.pathGroups = {};
		this.areaGroups = {};
		this.areaLayerGroup = L.layerGroup();
	}

	// Initialization Methods
	init() {
		this._initializePathLayer();
		this._initializeGeoman();

		if (this.isDebugMode) {
			this._initializeGeomanEventListeners();
			this._initializeDebugControls();
		}
	}

	_initializePathLayer() {
		if (!this.pathLayer) {
			this.pathLayer = L.layerGroup().addTo(this.map);
		}
	}

	_initializeGeoman() {
		this.map.pm.addControls({
			position: 'topleft',
			drawMarker: true,
			drawCircleMarker: false,
			drawPolygon: true,
			drawRectangle: false,
			drawCircle: false,
			editMode: true,
			dragMode: true,
			cutPolygon: false,
			removalMode: true,
		});

		if (!this.isDebugMode) {
			this.map.pm.removeControls();
		}
	}

	_initializeGeomanEventListeners() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Line' || e.shape === 'Polygon') {
				const path = e.layer;
				const pathData = this._convertPathToData(path);
				this.paths.push(pathData);
			}
		});

		this.map.on('pm:remove', (e) => {
			if (e.shape === 'Line' || e.shape === 'Polygon') {
				const removedLayer = e.layer;
				this.paths = this.paths.filter(
					(path) =>
						!path.points.every((point) =>
							removedLayer
								.getLatLngs()
								.some((latlng) => latlng.lat === point.coordinates[0] && latlng.lng === point.coordinates[1])
						)
				);
			}
		});

		this.map.on('pm:edit', (e) => {
			if (e.shape === 'Line' || e.shape === 'Polygon') {
				const editedLayer = e.layer;
				const pathIndex = this.paths.findIndex((path) =>
					path.points.every((point) =>
						editedLayer
							.getLatLngs()
							.some((latlng) => latlng.lat === point.coordinates[0] && latlng.lng === point.coordinates[1])
					)
				);
				if (pathIndex !== -1) {
					this.paths[pathIndex] = this._convertPathToData(editedLayer);
				}
			}
		});
	}

	_initializeDebugControls() {
		L.Control.ExportButton = L.Control.extend({
			onAdd: (map) => {
				const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
				const button = L.DomUtil.create('a', 'export-button', container);
				button.href = '#';
				button.title = 'Export Paths';
				button.innerHTML = '💾';
				L.DomEvent.on(button, 'click', this._exportPaths, this);
				return container;
			},
		});
		new L.Control.ExportButton({ position: 'topleft' }).addTo(this.map);
	}

	// Path Management Methods
	loadPaths(pathsData) {
		if (!Array.isArray(pathsData) || pathsData.length === 0) {
			console.warn('No valid path data provided');
			return;
		}
		this.paths = pathsData;
		this._createGeomanPaths();
	}

	_createGeomanPaths() {
		if (!this.map) {
			console.error('Map not initialized');
			return;
		}

		this.pathMasterGroup.clearLayers();
		this.pathGroups = {};

		this.paths.forEach((pathData, index) => {
			if (!pathData.points || !Array.isArray(pathData.points) || pathData.points.length < 2) {
				console.warn(`Invalid path data for path ${index}`);
				return;
			}

			let pathTextIndex = 0;
			const pathGroup = L.layerGroup();
			const textMarkers = []; // Array to store text markers for navigation

			// Create segments between points (previous segment code remains the same)
			for (let i = 0; i < pathData.points.length - 1; i++) {
				const startPoint = pathData.points[i];
				const endPoint = pathData.points[i + 1];
				const segmentColor = startPoint.pointColor || endPoint.pointColor || pathData.lineColor || '#F15B50';

				const segment = L.polyline([startPoint.coordinates, endPoint.coordinates], {
					color: segmentColor,
					weight: startPoint?.pointWidth || 2,
					opacity: 0.9,
					dashArray: [5, 5],
					smoothFactor: 9,
				});
				pathGroup.addLayer(segment);

				// Calculate midpoint
				const midPoint = {
					lat: (startPoint.coordinates[0] + endPoint.coordinates[0]) / 2,
					lng: (startPoint.coordinates[1] + endPoint.coordinates[1]) / 2,
				};

				// Calculate angle between points (adjusted for map projection)
				const angle =
					Math.atan2(
						endPoint.coordinates[1] - startPoint.coordinates[1],
						endPoint.coordinates[0] - startPoint.coordinates[0]
					) *
						(180 / Math.PI) -
					90; // Subtract 90 to align with map orientation

				// Create arrow marker with larger dimensions
				const arrowIcon = L.divIcon({
					className: 'path-arrow',
					html: `<div style="
						width: 40px;
						height: 40px;
						position: relative;
						transform: rotate(${angle}deg);
						opacity: 0.75;
					">
						<div style="
							position: absolute;
							top: 50%;
							left: 50%;
							width: 24px;
							height: 3px;
							background-color: transparent;
							transform: translate(-50%, -50%);
						">
							<div style="
								position: absolute;
								right: -2px;
								top: -4px;
								border: 5px solid transparent;
								border-left: 8px solid ${segmentColor};
							"></div>
						</div>
					</div>`,
					iconSize: [40, 40],
					iconAnchor: [20, 20],
				});

				const arrowMarker = L.marker([midPoint.lat, midPoint.lng], {
					icon: arrowIcon,
					interactive: false,
					zIndexOffset: 1000, // Ensure arrows appear above the path
				});
				pathGroup.addLayer(arrowMarker);

				segment.on('click', (e) => {
					const target = {
						type: 'path',
						id: pathData.name.toLowerCase().replace(/\s+/g, '_'),
						coordinates: startPoint.coordinates,
					};
					UrlManager.updateUrl(this.map.customMap.getCurrentMapKey(), true, target);
					L.DomEvent.stopPropagation(e);
				});
			}

			// Add text markers with navigation
			const textPoints = pathData.points.filter((point) => point.text);
			textPoints.forEach((point, idx) => {
				pathTextIndex++;

				// Create navigation buttons HTML
				const prevButton = idx > 0 ? `<button class="marker-nav-btn prev-marker">← Previous</button>` : '';
				const nextButton =
					idx < textPoints.length - 1 ? `<button class="marker-nav-btn next-marker">Next →</button>` : '';

				const popupContent = `
                    <div class="marker-popup-content">
                        <div class="marker-text">${point.text}</div>
                        <div class="marker-navigation">
                            ${prevButton}
                            ${nextButton}
                        </div>
                    </div>
                `;

				const markerDot = L.marker(point.coordinates, {
					icon: L.divIcon({
						className: 'path-text-dot',
						html: `${pathTextIndex}`,
					}),
				}).bindPopup(popupContent);

				markerDot.on('add', () => {
					const markerElement = markerDot.getElement();
					markerElement.style.backgroundColor = point.pointColor || pathData.lineColor || '#F15B50';
				});

				markerDot.on('popupopen', () => {
					const popup = markerDot.getPopup();
					const container = popup.getElement();

					// Add navigation button click handlers
					const prevBtn = container.querySelector('.prev-marker');
					const nextBtn = container.querySelector('.next-marker');

					if (prevBtn) {
						prevBtn.addEventListener('click', () => {
							markerDot.closePopup();
							const prevMarker = textMarkers[idx - 1];
							this.map.flyTo(prevMarker.getLatLng(), this.map.getMaxZoom() - 1);
							prevMarker.openPopup();
						});
					}

					if (nextBtn) {
						nextBtn.addEventListener('click', () => {
							markerDot.closePopup();
							const nextMarker = textMarkers[idx + 1];
							this.map.flyTo(nextMarker.getLatLng(), this.map.getMaxZoom() - 1);
							nextMarker.openPopup();
						});
					}
				});

				markerDot.on('click', () => {
					const target = {
						type: 'path',
						name: pathData.name,
						coordinates: point.coordinates,
						text: point.text,
					};
					UrlManager.updateUrl(this.map.customMap.getCurrentMapKey(), true, target);
				});

				textMarkers.push(markerDot);
				pathGroup.addLayer(markerDot);
			});

			this.pathGroups[pathData.name] = pathGroup;
			this.pathMasterGroup.addLayer(pathGroup);
		});

		this.pathMasterGroup.addTo(this.map);
		this.map.removeLayer(this.pathMasterGroup);

		this._createPathControls();
	}

	_createPathControls() {
		Object.entries(this.pathGroups).forEach(([pathName, pathLayer]) => {
			this.map.customMap.updateLayerGroup('paths', `🛣️ ${pathName}`, pathLayer);
		});
	}

	// Area Management Methods
	createGeomanAreas(areasData) {
		if (!areasData || Object.keys(areasData).length === 0) {
			console.warn('No valid area data provided');
			return;
		}

		this.areaLayerGroup.clearLayers();
		this.areaGroups = {};

		const layerControl = this.map.customMap.getLayerControl();

		layerControl.addGroup('areas', {
			label: '🗺️ Map areas',
			collapsed: false,
			defaultVisible: false,
		});

		for (const [categoryKey, category] of Object.entries(areasData)) {
			layerControl.addGroup(categoryKey, {
				label: category.name,
				parentId: 'areas',
				collapsed: true,
				defaultVisible: false,
			});

			this._processAreaCategory(categoryKey, category.items);
		}

		this.areaLayerGroup.addTo(this.map);
		this.map.removeLayer(this.areaLayerGroup);
	}

	_processAreaCategory(categoryKey, areaItems) {
		if (!Array.isArray(areaItems) || areaItems.length === 0) {
			console.warn(`No valid items in category ${categoryKey}`);
			return;
		}

		areaItems.forEach((area) => {
			if (!area.points || !Array.isArray(area.points) || area.points.length < 3) {
				console.warn(`Invalid area data for area ${area.name}`);
				return;
			}

			const areaGroup = this._createAreaGroup(area);

			this.areaGroups[area.name] = areaGroup;
			this.areaLayerGroup.addLayer(areaGroup);

			this.map.customMap.addLayerToSubgroup(areaGroup, area.name, categoryKey, {
				'data-area-name': area.name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(),
			});

			this._addAreaClickHandlers(categoryKey, area.name, areaGroup);
		});
	}

	_createAreaGroup(area) {
		const latlngs = area.points.map((point) => point.coordinates);

		const polygon = L.polygon(latlngs, {
			color: area.lineColor || 'transparent',
			fillColor: area.interiorColor || 'transparent',
			fillOpacity: 0.5,
		});

		const center = polygon.getBounds().getCenter();

		// Enhanced text marker with better centering and background
		const textMarker = L.marker(center, {
			icon: L.divIcon({
				className: 'polygon-text-container',
				html: `
				<div class="polygon-text-wrapper" style="
					position: relative;
					transform: translate(-50%, -50%);
					display: flex;
					align-items: center;
					justify-content: center;
				">
					<span class="polygon-text" style="
						transform: rotate(${area?.textRotation ?? '0deg'});
						font-size: ${area?.textSize ?? '10'}pt;
						font-family: var(--font-${area?.textFontType ?? 'description'});
						text-align: center;
						display: block;
					">${area.name}</span>
				</div>
			`,
				iconSize: null, // Allows the icon to size based on content
				iconAnchor: [0, 0], // Center point of the icon
			}),
			// Disable click events on the text to allow clicking through to the polygon
			interactive: false,
		});

		// Add click handler to polygon
		polygon.on('click', (e) => {
			const target = {
				type: 'area',
				id: area.name.toLowerCase().replace(/\s+/g, '_'),
				coordinates: [center.lat, center.lng],
			};
			UrlManager.updateUrl(this.map.customMap.getCurrentMapKey(), true, target);
			L.DomEvent.stopPropagation(e);
		});

		return L.layerGroup([polygon, textMarker]);
	}

	_addAreaClickHandlers(categoryKey, areaName, areaGroup) {
		setTimeout(() => {
			const labelElements = document.querySelectorAll(
				`[data-category="${categoryKey}"] label[data-area-name="${areaName
					.replace(/[^a-zA-Z0-9-]/g, '-')
					.toLowerCase()}"]`
			);

			labelElements.forEach((labelElement) => {
				labelElement.removeEventListener('click', labelElement._zoomHandler);

				labelElement._zoomHandler = (e) => {
					if (e.target.tagName.toLowerCase() === 'input') {
						return;
					}

					e.preventDefault();
					e.stopPropagation();

					const bounds = this._getAreaGroupBounds(areaGroup);

					this.map.fitBounds(bounds, {
						padding: [50, 50],
						animate: true,
						duration: 1,
					});
				};

				labelElement.addEventListener('click', labelElement._zoomHandler);
				labelElement.style.cursor = 'pointer';
				labelElement.title = 'Click to zoom to area';
			});
		}, 100);
	}

	_getAreaGroupBounds(areaGroup) {
		let bounds = null;
		areaGroup.eachLayer((layer) => {
			if (layer instanceof L.Polygon) {
				bounds = layer.getBounds();
			}
		});
		return bounds;
	}

	// Focus Methods
	focusPath(target) {
		if (!target?.name) return;

		setTimeout(() => {
			const pathGroup = this.pathGroups[target.name];
			if (pathGroup) {
				this.pathMasterGroup.addTo(this.map);
				pathGroup.addTo(this.map);
				this.map.customMap.updateLayerGroup('paths', `🛣️ ${target.name}`, pathGroup);
			}
		}, 100);
	}

	focusArea(target) {
		if (!target?.id) return;

		const areaName = target.id
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		setTimeout(() => {
			const areaGroup = this.areaGroups[areaName];
			if (areaGroup) {
				this.areaLayerGroup.addTo(this.map);
				areaGroup.addTo(this.map);

				const bounds = this._getAreaGroupBounds(areaGroup);
				if (bounds) {
					this.map.fitBounds(bounds, {
						padding: [50, 50],
						animate: true,
						duration: 1,
					});
				}
			}
		}, 100);
	}

	// Utility Methods
	_convertPathToData(path) {
		const latlngs = path.getLatLngs();
		let points = [];

		if (Array.isArray(latlngs[0])) {
			latlngs.forEach((ring) => {
				ring.forEach((latlng) => {
					points.push({
						coordinates: [latlng.lat, latlng.lng],
					});
				});
			});
		} else {
			points = latlngs.map((latlng) => ({
				coordinates: [latlng.lat, latlng.lng],
			}));
		}

		return {
			name: `Path ${this.paths.length + 1}`,
			points: points,
		};
	}

	_exportPaths() {
		console.log('paths:', JSON.stringify(this.paths, null, 2));
	}
}

class PolylineManager {
	constructor(map) {
		this.map = map;
		this.currentPolyline = null;
		this.points = [];
		this.texts = {};
		this.isDrawing = false;
		this.initializeControls();
	}

	initializeControls() {
		// Handle drawing start
		this.map.on('pm:drawstart', (e) => {
			if (e.shape === 'Line') {
				this.isDrawing = true;
				this.points = [];
				this.texts = {};
				this.currentPolyline = e.workingLayer;

				// Add click handler for the map while drawing
				this.map.on('click', this.handleMapClick.bind(this));
			}
		});

		// Handle drawing end
		this.map.on('pm:drawend', (e) => {
			if (this.isDrawing) {
				this.isDrawing = false;
				this.map.off('click', this.handleMapClick.bind(this));
				if (this.points.length > 0) {
					this.openPolylineModal();
				}
			}
		});
	}

	handleMapClick(e) {
		if (!this.isDrawing) return;

		const latLng = e.latlng;
		const coordinates = [latLng.lat, latLng.lng];

		// Add point to our array
		const pointIndex = this.points.length;
		this.points.push({
			coordinates: coordinates,
		});

		// If shift key is pressed, open text input modal
		if (e.originalEvent.shiftKey) {
			this.openTextInputModal(pointIndex);
		}
	}

	openTextInputModal(pointIndex) {
		const modal = document.createElement('div');
		modal.className = 'debug__line-text-modal';

		modal.innerHTML = `
            <h4 class="debug__line-text-modal--title">Add text for point ${pointIndex + 1}</h3>
            <textarea 
                id="debug-line-text-input" 
                rows="4" 
				class="debug__line-text-modal--textarea"
                placeholder="Enter description for this point..."></textarea>
            <div class="debug__line-text-modal--actions">
                <button class="debug__line-text-modal--action" id="debug-line-text-cancel" style="margin-left: auto; background: #E2B203; color: black;">Cancel</button>
                <button class="debug__line-text-modal--action" id="debug-line-text-save" style="background: #22A06B; color: white;">Save</button>
            </div>
        `;

		document.body.appendChild(modal);

		// Handle save
		document.getElementById('debug-line-text-save').onclick = () => {
			const text = document.getElementById('debug-line-text-input').value;
			if (text) {
				this.points[pointIndex].text = text;
			}
			modal.remove();
		};

		// Handle cancel
		document.getElementById('debug-line-text-cancel').onclick = () => {
			modal.remove();
		};
	}

	openPolylineModal() {
		const modal = document.createElement('div');
		modal.className = 'debug__line-modal';

		modal.innerHTML = `
            <h3 class="debug__line-modal--title">Polyline Properties</h3>
            <div class="debug__line-modal--row">
                <label>Name:</label>
                <input type="text" id="debug-line-name" value="New Polyline">
            </div>
            <div class="debug__line-modal--row">
                <label>Line Color:</label>
                <div style="display: flex; gap: 0.25rem;">
                    <input type="color" id="lineColorPicker" value="#2898BD" style="width: 50px;">
                    <input type="text" id="lineColor" style="width: calc(100% - 50px);" value="#2898BD">
                </div>
            </div>
            <div class="debug__line-modal--row">
                <label>Preview:</label>
                <pre id="debug-line-json-preview"></pre>
            </div>
            <div class="debug__line-modal--row">
                <button id="debug-line-copy" class="debug__line-modal--action">Copy to Clipboard</button>
            </div>
        `;

		// Add backdrop
		const backdrop = document.createElement('div');
		backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;

		document.body.appendChild(backdrop);
		document.body.appendChild(modal);

		// Handle color picker changes
		const colorPicker = document.getElementById('lineColorPicker');
		const colorInput = document.getElementById('lineColor');

		colorPicker.addEventListener('input', (e) => {
			const color = e.target.value.toUpperCase();
			colorInput.value = color;
			this.updatePreview();
			if (this.currentPolyline) {
				this.currentPolyline.setStyle({ color: color });
			}
		});

		colorInput.addEventListener('input', (e) => {
			colorPicker.value = e.target.value;
			this.updatePreview();
			if (this.currentPolyline) {
				this.currentPolyline.setStyle({ color: e.target.value });
			}
		});

		// Handle name input changes
		document.getElementById('debug-line-name').addEventListener('input', () => {
			this.updatePreview();
		});

		// Initial preview update
		this.updatePreview();

		// Handle copy button
		document.getElementById('debug-line-copy').onclick = () => {
			const polylineData = this.getPolylineData();
			navigator.clipboard
				.writeText(JSON.stringify(polylineData, null, 2))
				.then(() => alert('Copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};

		// Close on backdrop click
		backdrop.onclick = () => {
			modal.remove();
			backdrop.remove();
		};
	}

	updatePreview() {
		const previewElement = document.getElementById('debug-line-json-preview');
		if (previewElement) {
			const data = this.getPolylineData();
			previewElement.textContent = JSON.stringify(data, null, 2);
		}
	}

	getPolylineData() {
		return {
			name: document.getElementById('debug-line-name').value || 'New Polyline',
			lineColor: document.getElementById('lineColor').value,
			points: this.points.map((point) => {
				const pointData = {
					coordinates: point.coordinates,
				};
				if (point.text) {
					pointData.text = point.text;
				}
				return pointData;
			}),
		};
	}
}
class MarkerManager {
	constructor(map, isDebugMode, iconsPath = 'images/custom-icons/') {
		if (!map) {
			throw new Error('Map is required for MarkerManager');
		}
		this.map = map;
		this.isDebugMode = isDebugMode;
		this.markers = [];
		this.iconsPath = iconsPath;
		this.currentPolygon = null;
		this.polygonPoints = [];
		this.polylineManager = new PolylineManager(map);

		setTimeout(() => {
			this._initializeGeoman();
			this._setupMarkerCreateHandler();
			this._setupPolygonCreateHandler();
		}, 100);
	}

	_initializeGeoman() {
		this.map.pm.addControls({
			position: 'topleft',
			drawMarker: true,
			drawCircleMarker: false,
			drawPolygon: true,
			drawRectangle: false,
			drawCircle: false,
			editMode: false,
			dragMode: false,
			cutPolygon: false,
			removalMode: false,
		});

		if (!this.isDebugMode) {
			this.map.pm.removeControls();
		}
	}

	_setupMarkerCreateHandler() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Marker') {
				const marker = e.marker;
				const position = marker.getLatLng();

				// Remove the temporary marker
				this.map.removeLayer(marker);

				// Initialize and open modal only when needed
				this._initializeModal();
				this._openModal(position);
			}
		});
	}

	_setupPolygonCreateHandler() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Polygon') {
				const polygon = e.layer;
				// Get coordinates and ensure they're in the correct format
				const coordinates = polygon.getLatLngs()[0].map((latLng) => {
					// Round to 6 decimal places for precision
					const lat = parseFloat(latLng.lat.toFixed(6));
					const lng = parseFloat(latLng.lng.toFixed(6));
					return [lat, lng]; // Note: we return [lng, lat] to match the desired format
				});

				// Remove the temporary polygon
				this.map.removeLayer(polygon);

				// Initialize and open polygon modal
				this._initializePolygonModal();
				this._openPolygonModal(coordinates);
			}
		});
	}

	_initializePolygonModal() {
		const existingModal = document.getElementById('debug-polygon-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modalHtml = `
            <div id="debug-polygon-modal" class="marker-modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3 class="debug__polygon-modal--title">Polygon Properties</h2>
                    <form id="debug-polygon-form">
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-name">Name:</label>
                            <input type="text" id="debug-polygon-modal-name" name="debug-polygon-modal-name" required>
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-rotation">Text Rotation:</label>
                            <input type="number" id="debug-polygon-modal-text-rotation" name="debug-polygon-modal-text-rotation" value="0">
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-size">Text Size:</label>
                            <input type="number" id="debug-polygon-modal-text-size" name="debug-polygon-modal-text-size" value="16">
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-font-type">Font Type:</label>
                            <select id="debug-polygon-modal-text-font-type" name="debug-polygon-modal-text-font-type">
                                <option value="title">Title</option>
                                <option value="description">Description</option>
                            </select>
                        </div>
						<div class="debug__polygon-modal--row">
							<div class="debug__polygon-modal--column" style="width: 30%;">
								<label for="debug-polygon-modal-line-color">Line Color:</label>
								<input type="color" id="debug-polygon-modal-line-color" name="debug-polygon-modal-line-color">
							</div>
							<div class="debug__polygon-modal--column">
								<label for="debug-polygon-modal-interior-color">Interior Color:</label>
								<div class="debug__polygon-modal--row">
									<input type="color" id="debug-polygon-modal-interior-color" name="debug-polygon-modal-interior-color" value="#E2B203">
									<input type="range" id="debug-polygon-modal-interior-color-opacity" name="opacity" min="0" max="100" value="40">
									<span id="debug-polygon-modal-interior-color-opacity-value">40%</span>
								</div>
							</div>
						</div>
						<div class="debug__polygon-modal--row">
							<button class="debug__polygon-modal--action" type="submit">Save</button>
                        	<button class="debug__polygon-modal--action" type="button" id="debug-polygon-modal-copy-json">Copy to Clipboard</button>
						</div>
                    </form>
                    <div id="debug-polygon-modal-json-preview" style="display: none;">
                        <pre></pre>
                    </div>
                </div>
            </div>
        `;

		document.body.insertAdjacentHTML('beforeend', modalHtml);
		this._initializePolygonModalEvents();
	}

	_initializePolygonModalEvents() {
		const modal = document.getElementById('debug-polygon-modal');
		const form = document.getElementById('debug-polygon-form');
		const closeBtn = modal.querySelector('.close');
		const copyBtn = document.getElementById('debug-polygon-modal-copy-json');
		const opacitySlider = document.getElementById('debug-polygon-modal-interior-color-opacity');
		const opacityValue = document.getElementById('debug-polygon-modal-interior-color-opacity-value');

		opacitySlider.addEventListener('input', (e) => {
			opacityValue.textContent = `${e.target.value}%`;
		});

		closeBtn.onclick = () => (modal.style.display = 'none');

		window.onclick = (e) => {
			if (e.target === modal) modal.style.display = 'none';
		};

		form.onsubmit = (e) => {
			e.preventDefault();
			const polygonData = this._getPolygonFormData();
			this._updatePolygonJsonPreview(polygonData);
		};

		copyBtn.onclick = () => {
			const polygonData = this._getPolygonFormData();
			const jsonString = JSON.stringify(polygonData, null, 2);
			navigator.clipboard
				.writeText(jsonString)
				.then(() => alert('Polygon data copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};
	}

	_getPolygonFormData() {
		const opacity = document.getElementById('debug-polygon-modal-interior-color-opacity').value;
		const interiorColor = this._getRGBAColor(
			document.getElementById('debug-polygon-modal-interior-color').value,
			opacity
		);

		return {
			name: document.getElementById('debug-polygon-modal-name').value,
			textRotation: `${document.getElementById('debug-polygon-modal-text-rotation').value}deg`,
			textSize: parseInt(document.getElementById('debug-polygon-modal-text-size').value),
			textFontType: document.getElementById('debug-polygon-modal-text-font-type').value,
			lineColor: document.getElementById('debug-polygon-modal-line-color').value || null,
			interiorColor,
			points: this.currentPolygonPoints.map((coord) => ({
				coordinates: coord,
			})),
		};
	}

	_getRGBAColor(hex, opacity) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgb(${r} ${g} ${b} / ${opacity}%)`;
	}

	_openPolygonModal(coordinates) {
		this.currentPolygonPoints = coordinates;
		const modal = document.getElementById('debug-polygon-modal');
		modal.style.display = 'block';
	}

	_updatePolygonJsonPreview(data) {
		const jsonPreview = document.getElementById('debug-polygon-modal-json-preview');
		jsonPreview.style.display = 'block';
		jsonPreview.querySelector('pre').textContent = JSON.stringify(data, null, 2);
	}

	_initializeModal() {
		const existingModal = document.getElementById('debug-marker-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modalHtml = `
            <div id="debug-marker-modal" class="marker-modal">
                <div class="modal-content">
                    <span class="close" style="">&times;</span>
                    <h2>Add Marker</h2>
                    <form id="debug-marker-modal-form">
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-lat">Latitude:</label>
                            <input type="number" id="debug-marker-modal-lat" name="debug-marker-modal-lat" step="any" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-lng">Longitude:</label>
                            <input type="number" id="debug-marker-modal-lng" name="debug-marker-modal-lng" step="any" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-label">Label:</label>
                            <input type="text" id="debug-marker-modal-label" name="debug-marker-modal-label" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-type">Type:</label>
                            <select id="debug-marker-modal-type" name="debug-marker-modal-type" required>
                                <option value="people">People</option>
                                <option value="place">Place</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div class="marker-form-item">
                            <div id="debug-marker-modal-icon-preview" style="margin-top: 5px; text-align: center; min-height: 24px;">
                                <!-- Icon preview will be shown here -->
                            </div>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-icon-type">Icon Type:</label>
                            <select id="debug-marker-modal-icon-type" name="debug-marker-modal-icon-type" required>
                                <option value="png">PNG</option>
                                <option value="svg">SVG</option>
                            </select>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-map-link">Map Link:</label>
                            <input type="text" id="debug-marker-modal-map-link" name="debug-marker-modal-map-link">
                        </div>
                        <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 0.25rem;">Save</button>
                        <button type="button" id="debug-marker-modal-copy-json" style="background-color: #008CBA; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 0.25rem;">Copy JSON</button>
                    </form>
                    <div id="debug-marker-modal-json-preview" style="margin-top: 15px; padding: 10px; background-color: #f5f5f5; display: none;">
                        <pre style="margin: 0; white-space: pre-wrap;"></pre>
                    </div>
                </div>
            </div>
        `;

		const modalContainer = document.createElement('div');
		modalContainer.innerHTML = modalHtml;
		document.body.appendChild(modalContainer.firstElementChild);

		this.modal = document.getElementById('debug-marker-modal');
		this.form = document.getElementById('debug-marker-modal-form');
		this.closeBtn = this.modal.querySelector('.close');
		this.copyBtn = document.getElementById('debug-marker-modal-copy-json');
		this.jsonPreview = document.getElementById('debug-marker-modal-json-preview');

		// Fetch and populate icons
		this._fetchIcons();

		this._initializeModalEvents();
	}

	async _fetchIcons() {
		try {
			// Fetch the icons.json file that contains the list of available icons
			const response = await fetch(`${this.iconsPath}icons.json`);
			if (!response.ok) {
				throw new Error('Failed to fetch icons list');
			}

			const icons = await response.json();
			const iconPreview = document.getElementById('debug-marker-modal-icon-preview');

			const noneOption = document.createElement('span');
			noneOption.textContent = 'None';
			noneOption.className = 'debug__marker-modal--icon-text';
			noneOption.title = 'No icon';

			noneOption.onclick = (event) => {
				this._selectImageOption(event.target);
			};
			iconPreview.append(noneOption);

			icons.forEach((icon) => {
				const img = document.createElement('img');
				img.src = `${this.iconsPath}${icon.id}.png`;
				img.style.maxHeight = '40px';
				img.className = 'debug__marker-modal--icon';
				img.title = icon.id;
				img.dataset.iconId = icon.id;
				iconPreview.appendChild(img);

				img.onclick = (event) => {
					this._selectImageOption(event.target);
				};
			});
		} catch (error) {
			console.error('Error loading icons:', error);
			// Fallback to a basic set of icons if the fetch fails
			const fallbackIcons = ['tradeForge', 'inn', 'shop', 'temple'];
			const iconSelect = document.getElementById('debug-marker-modal-icon');

			fallbackIcons.forEach((icon) => {
				const option = document.createElement('option');
				option.value = icon;
				option.textContent = icon;
				iconSelect.appendChild(option);
			});
		}
	}

	_selectImageOption(target) {
		if (!target) return;
		const elements = this.modal
			.querySelectorAll('.debug__marker-modal--icon, .debug__marker-modal--icon-text')
			.forEach((item) => {
				item.classList.remove('icon-selected');
			});

		target.classList.add('icon-selected');
	}

	_initializeModalEvents() {
		// Close modal when clicking X
		this.closeBtn.onclick = () => {
			this._closeModal();
		};

		// Close modal when clicking outside
		window.onclick = (event) => {
			if (event.target === this.modal) {
				this._closeModal();
			}
		};

		// Handle form submission
		this.form.onsubmit = (e) => {
			e.preventDefault();
			const markerData = this._getFormData();
			this.markers.push(markerData);
			this._updateJsonPreview(markerData);
		};

		// Handle copy button
		this.copyBtn.onclick = () => {
			const markerData = this._getFormData();
			const jsonString = this._formatMarkerJson(markerData);
			navigator.clipboard
				.writeText(jsonString)
				.then(() => alert('JSON copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};
	}

	_openModal(position) {
		this.modal.style.display = 'block';
		document.getElementById('debug-marker-modal-lat').value = position.lat.toFixed(6);
		document.getElementById('debug-marker-modal-lng').value = position.lng.toFixed(6);
		this.jsonPreview.style.display = 'none';
	}

	_closeModal() {
		this.modal.style.display = 'none';
		this.form.reset();
	}

	_getFormData() {
		const selectedIcon = document?.querySelector('.debug__marker-modal--icon.icon-selected')?.dataset?.iconId;
		return {
			lat: parseFloat(document.getElementById('debug-marker-modal-lat').value),
			lng: parseFloat(document.getElementById('debug-marker-modal-lng').value),
			label: document.getElementById('debug-marker-modal-label').value,
			type: document.getElementById('debug-marker-modal-type').value,
			icon: selectedIcon && selectedIcon !== undefined ? selectedIcon + '.png' : null,
			iconType: document.getElementById('debug-marker-modal-icon-type').value,
			mapLink: document.getElementById('debug-marker-modal-map-link').value || undefined,
		};
	}

	_formatMarkerJson(data) {
		// Remove undefined properties
		Object.keys(data).forEach((key) => {
			if (data[key] === undefined) {
				delete data[key];
			}
		});
		return JSON.stringify(data, null, 2);
	}

	_updateJsonPreview(data) {
		const jsonString = this._formatMarkerJson(data);
		this.jsonPreview.style.display = 'block';
		this.jsonPreview.querySelector('pre').textContent = jsonString;
	}

	// Export all markers
	exportMarkers() {
		return JSON.stringify(this.markers, null, 2);
	}
}
