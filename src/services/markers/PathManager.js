class PathManager {
	constructor(map, isDebugMode) {
		this.map = map;
		this.paths = [];
		this.isDebugMode = isDebugMode;
		this.pathMasterGroup = L.layerGroup();
		this.pathGroups = {};
		this.areaGroups = {};
		this.areaLayerGroup = L.layerGroup();
		this.pathAnimationControl = new PathAnimationControl(this.map);
		this.pathAnimations = new Map();
		this.filterManager = new MapFilterManager(map);
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
				const prevButton = idx > 0 ? `<button class="marker-nav-btn prev-marker">Previous</button>` : '';
				const nextButton =
					idx < textPoints.length - 1 ? `<button class="marker-nav-btn next-marker">Next</button>` : '';

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

			const allPoints = pathData.points;

			// Then create the animation as before:
			const pathId = pathData.name.toLowerCase().replace(/\s+/g, '_');
			const duration = Math.max(5000, pathData.points.length * 1000);
			this.pathAnimationControl.createAnimation(pathId, allPoints, duration);

			// Update animation visibility when path visibility changes
			pathGroup.on('add remove', (e) => {
				this.pathAnimationControl.updateAnimationVisibility(pathId, this.map.hasLayer(pathGroup));
			});
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
				<input id="debug-line-wait-input" type="number" placeholder="Wait timer"/>
				<select id="debug-line-wait-type">
					<option value="null">None</option>
					<option value="fight">⚔️</option>
					<option value="merchant">💰</option>
					<option value="rest">💤</option>
					<option value="conversation">💬</option>
					<option value="loot">💎</option>
					<option value="walk">👣</option>
					<option value="question">❓</option>
				</select>
			</div>
            <div class="debug__line-text-modal--actions">
                <button class="debug__line-text-modal--action" id="debug-line-text-cancel" style="margin-left: auto; background: #E2B203; color: black;">Cancel</button>
                <button class="debug__line-text-modal--action" id="debug-line-text-save" style="background: #22A06B; color: white;">Save</button>
            </div>
        `;

		document.body.appendChild(modal);

		// Handle save
		document.getElementById('debug-line-text-save').onclick = () => {
			const text = document.getElementById('debug-line-text-input').value;
			const waitTimer = document.getElementById('debug-line-wait-input').value;
			const waitType = document.getElementById('debug-line-wait-type').value;

			if (text) {
				this.points[pointIndex].text = text;
			}

			if (waitTimer) {
				this.points[pointIndex].animationInfo = this.points[pointIndex].animationInfo || {};
				this.points[pointIndex].animationInfo.waitTimer = parseInt(waitTimer);
			}

			if (waitType) {
				if (!waitTimer && waitType == 'null') {
				} else {
					this.points[pointIndex].animationInfo = this.points[pointIndex].animationInfo || {};
					this.points[pointIndex].animationInfo.animationType = waitType;
				}
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
				if (point.animationInfo && point.animationInfo.waitTimer) {
					pointData.animationInfo = pointData.animationInfo || {};
					pointData.animationInfo.waitTimer = point.animationInfo.waitTimer;
				}
				if (point.animationInfo && point.animationInfo.animationType) {
					pointData.animationInfo = pointData.animationInfo || {};
					pointData.animationInfo.animationType = point.animationInfo.animationType;
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
			icon: selectedIcon && selectedIcon !== undefined ? selectedIcon : null,
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

class PathAnimationControl {
	constructor(map) {
		this.map = map;
		this.animations = new Map();
		this.markers = new Map();
		this.currentPoints = new Map();
		this.pathVisibility = new Map();
		this.isAnimating = new Map();
		this.effects = new Map();
		this.passedPoints = new Map(); // Track points that have been passed
		this.textModal = this.createTextModal();
		this.isModalCollapsed = window.innerWidth < 768; // Collapsed by default on mobile
		this.filterManager = new MapFilterManager(map);
		this.currentFilter = null;
	}

	createMarker() {
		return L.divIcon({
			className: 'animated-marker',
			html: `
                <div class="marker-container" style="
                    width: 32px;
                    height: 32px;
                    position: relative;
                    transform-origin: center;
                ">
                    <img src="images/pageicon.png" style="
                        width: 32px;
                        transition: all 0.3s ease;
                        transform-origin: center;
                    " />
                    <div class="effect-container" style="
                        position: absolute;
                        top: -40px;
                        left: 50%;
                        transform: translateX(-50%) scale(0);
                        text-align: center;
                        font-size: 24px;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        opacity: 0;
                    "></div>
                </div>
            `,
			iconSize: [40, 40],
			iconAnchor: [20, 20],
		});
	}

	createTextModal() {
		// Create modal container
		const modal = L.DomUtil.create('div', 'path-text-modal');
		const header = L.DomUtil.create('div', 'path-text-header', modal);

		const title = L.DomUtil.create('span', 'path-text-title', header);
		title.textContent = 'Recap so far';

		const toggleButton = L.DomUtil.create('button', 'path-text-toggle', header);
		toggleButton.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 9l6 6l6 -6"></path></svg>';

		// Create list container
		const listContainer = L.DomUtil.create('div', 'path-text-list-container', modal);

		// Create list container
		const list = L.DomUtil.create('ul', 'path-text-list', listContainer);

		// Add click handler for toggle
		header.addEventListener('click', () => this.toggleModal());

		document.querySelector('.leaflet-container').appendChild(modal);

		// Initialize the state after the modal is fully created
		if (this.isModalCollapsed) {
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
		}

		return modal;
	}

	toggleModal() {
		this.isModalCollapsed = !this.isModalCollapsed;
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (this.isModalCollapsed) {
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
			listContainer.style.display = 'none';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
			listContainer.style.display = 'block';
		}
	}

	updateModalState() {
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (this.isModalCollapsed) {
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
			this.textModal.style.transform = 'translateY(calc(100% - 45px))';
			listContainer.style.display = 'none';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
			this.textModal.style.transform = 'translateY(0)';
			listContainer.style.display = 'block';
		}
	}

	addTextToModal(text, pathId, animationType) {
		const list = this.textModal.querySelector('.path-text-list');
		const listItem = document.createElement('li');
		listItem.classList.add('path-text-item');

		// Add icon based on animation type
		let icon = '';
		switch (animationType) {
			case 'fight':
				icon = '⚔️';
				break;
			case 'merchant':
				icon = '💰';
				break;
			case 'rest':
				icon = '💤';
				break;
			case 'conversation':
				icon = '💬';
				break;
			case 'loot':
				icon = '💎';
				break;
			case 'question':
				icon = '❓';
				break;
			default:
				icon = '👣';
		}

		listItem.innerHTML = `<span class="path-text">${text}</span><span class="path-event-icon">${icon}</span>`;
		list.appendChild(listItem);

		// Show modal if it's the first item
		if (list.children.length === 1) {
			this.textModal.style.display = 'block';
		}

		list.scrollTo({ left: 0, top: list.scrollHeight, behavior: 'smooth' });
	}

	clearTextModal(pathId) {
		const list = this.textModal.querySelector('.path-text-list');
		list.innerHTML = '';
		this.passedPoints.set(pathId, new Set());
		this.textModal.style.display = 'none';
	}

	showEffect(marker, type) {
		const container = marker.getElement().querySelector('.effect-container');
		const markerImg = marker.getElement().querySelector('img');

		// Bounce animation for marker
		markerImg.style.transform = 'scale(1.2)';
		setTimeout(() => {
			markerImg.style.transform = 'scale(1)';
		}, 300);

		let effectContent = '';
		switch (type) {
			case 'fight':
				effectContent = '⚔️';
				break;
			case 'merchant':
				effectContent = '💰';
				break;
			case 'rest':
				effectContent = '💤';
				break;
			case 'conversation':
				effectContent = '💬';
				break;
			case 'loot':
				effectContent = '💎';
				break;
			case 'walk':
				effectContent = '👣';
				break;
			case 'question':
				effectContent = '❓';
				break;
		}

		container.textContent = effectContent;
		container.style.display = 'block';

		// Animated appearance
		setTimeout(() => {
			container.style.transform = 'translateX(-50%) scale(1)';
			container.style.opacity = '1';
		}, 50);
	}

	hideEffect(marker) {
		const container = marker.getElement().querySelector('.effect-container');
		const markerImg = marker.getElement().querySelector('img');

		// Fade out animation
		container.style.transform = 'translateX(-50%) scale(0)';
		container.style.opacity = '0';

		// Bounce animation for marker
		markerImg.style.transform = 'scale(0.8)';
		setTimeout(() => {
			markerImg.style.transform = 'scale(1)';
		}, 300);

		// Clean up after animation
		setTimeout(() => {
			container.style.display = 'none';
		}, 300);
	}

	calculatePathDistance(points) {
		let distance = 0;
		for (let i = 0; i < points.length - 1; i++) {
			const p1 = L.latLng(points[i]);
			const p2 = L.latLng(points[i + 1]);
			distance += p1.distanceTo(p2);
		}
		return distance;
	}

	interpolatePosition(points, percentage) {
		// Find current and next filter points
		const findActiveFilter = (currentIndex) => {
			// Look backward for the last valid filter
			for (let i = currentIndex; i >= 0; i--) {
				if (points[i].filter !== undefined) {
					return points[i].filter;
				}
			}
			return null; // No filter found
		};

		if (Math.abs(percentage - 1) < 0.01) {
			const lastPoint = points[points.length - 1];
			return {
				position: lastPoint.coordinates,
				animationInfo: lastPoint.animationInfo,
				text: lastPoint.text,
				filter: findActiveFilter(points.length - 1),
			};
		}

		const totalDistance = this.calculatePathDistance(points.map((p) => p.coordinates));
		const targetDistance = totalDistance * percentage;
		let currentDistance = 0;

		for (let i = 0; i < points.length - 1; i++) {
			const p1 = L.latLng(points[i].coordinates);
			const p2 = L.latLng(points[i + 1].coordinates);
			const segmentDistance = p1.distanceTo(p2);

			if (currentDistance + segmentDistance >= targetDistance) {
				const remainingDistance = targetDistance - currentDistance;
				const ratio = remainingDistance / segmentDistance;

				const lat = p1.lat + (p2.lat - p1.lat) * ratio;
				const lng = p1.lng + (p2.lng - p1.lng) * ratio;

				// Determine which point we're closer to for animation info and text
				const nearPoint = Math.abs(ratio - 0) < 0.01 ? points[i] : Math.abs(ratio - 1) < 0.01 ? points[i + 1] : null;

				return {
					position: [lat, lng],
					animationInfo: nearPoint?.animationInfo,
					text: nearPoint?.text,
					filter: findActiveFilter(i), // Get the active filter for current position
				};
			}

			currentDistance += segmentDistance;
		}

		// Fallback to last point
		const lastPoint = points[points.length - 1];
		return {
			position: lastPoint.coordinates,
			animationInfo: lastPoint.animationInfo,
			text: lastPoint.text,
			filter: findActiveFilter(points.length - 1),
		};
	}

	createAnimation(pathId, points, duration = 5000) {
		const marker = L.marker([points[0].coordinates[0], points[0].coordinates[1]], {
			icon: this.createMarker(),
			interactive: false,
			zIndexOffset: 1000,
		});

		this.markers.set(pathId, marker);
		this.currentPoints.set(pathId, points);

		if (this.pathVisibility.get(pathId)) {
			this.startAnimation(pathId, points, duration);
		}

		return marker;
	}

	startAnimation(pathId, points, duration) {
		if (this.isAnimating.get(pathId)) return;

		this.isAnimating.set(pathId, true);
		const marker = this.markers.get(pathId);

		if (!this.passedPoints.has(pathId)) {
			this.passedPoints.set(pathId, new Set());
		}

		if (marker && !this.map.hasLayer(marker)) {
			marker.addTo(this.map);
		}

		let startTime = null;
		let pauseStartTime = null;
		let totalPausedTime = 0;
		let currentAnimationInfo = null;
		let hasReachedEnd = false;

		const animate = (timestamp) => {
			if (!this.pathVisibility.get(pathId) || !this.isAnimating.get(pathId)) {
				this.stopAnimation(pathId);
				return;
			}

			if (!startTime) startTime = timestamp;

			if (pauseStartTime !== null) {
				const currentPauseTime = timestamp - pauseStartTime;
				if (currentPauseTime < (currentAnimationInfo?.waitTimer || 0) * 1000) {
					const animationId = requestAnimationFrame(animate);
					this.animations.set(pathId, animationId);
					return;
				} else {
					totalPausedTime += currentPauseTime;
					pauseStartTime = null;
				}
			}

			const effectiveTime = timestamp - startTime - totalPausedTime;
			let progress = (effectiveTime % duration) / duration;

			if (progress > 0.99 && !hasReachedEnd) {
				progress = 1.0;
				hasReachedEnd = true;
			}

			const { position, animationInfo, text, filter } = this.interpolatePosition(points, progress);

			if (marker) {
				marker.setLatLng(position);

				// Handle filter changes - only process actual changes and valid filters
				if (filter !== this.currentFilter) {
					// If there's a current filter, disable it
					if (this.currentFilter) {
						this.filterManager.applyFilter({
							mode: this.currentFilter,
							enabled: false,
						});
					}

					// If there's a new filter (and it's not null/undefined), enable it
					if (filter) {
						this.filterManager.applyFilter({
							mode: filter,
							enabled: true,
						});
					}

					this.currentFilter = filter;
				}

				// Handle other animations...
				if (text && !this.passedPoints.get(pathId).has(text)) {
					this.passedPoints.get(pathId).add(text);
					this.addTextToModal(text, pathId, animationInfo?.animationType);
				}

				if (animationInfo && animationInfo !== currentAnimationInfo) {
					currentAnimationInfo = animationInfo;

					if (animationInfo.waitTimer) {
						pauseStartTime = timestamp;
					}

					if (animationInfo.animationType) {
						this.showEffect(marker, animationInfo.animationType);
						setTimeout(() => {
							this.hideEffect(marker);
						}, (animationInfo.waitTimer || 1) * 1000);
					}
				}
			}

			const animationId = requestAnimationFrame(animate);
			this.animations.set(pathId, animationId);
		};

		const animationId = requestAnimationFrame(animate);
		this.animations.set(pathId, animationId);
	}

	stopAnimation(pathId) {
		this.isAnimating.set(pathId, false);

		if (this.animations.has(pathId)) {
			cancelAnimationFrame(this.animations.get(pathId));
			this.animations.delete(pathId);
		}

		if (this.markers.has(pathId)) {
			const marker = this.markers.get(pathId);
			if (marker && this.map.hasLayer(marker)) {
				marker.remove();
			}
		}

		// Clear the current filter
		if (this.currentFilter) {
			this.filterManager.applyFilter({
				mode: this.currentFilter,
				enabled: false,
			});
			this.currentFilter = null;
		}
	}

	updateAnimationVisibility(pathId, visible) {
		this.pathVisibility.set(pathId, visible);

		if (visible) {
			const points = this.currentPoints.get(pathId);
			if (points) {
				const duration = Math.max(5000, points.length * 1000);
				if (this.markers.has(pathId)) {
					this.clearTextModal(pathId); // Clear modal when starting new animation
					this.startAnimation(pathId, points, duration);
				} else {
					this.createAnimation(pathId, points, duration);
				}
			}
		} else {
			this.stopAnimation(pathId);
			this.clearTextModal(pathId); // Clear modal when hiding animation
		}
	}
}

class MapFilterManager {
	constructor(map) {
		this.map = map;
		this.activeFilters = new Set();
		this.filterStyles = {
			night: {
				className: 'night-filter',
				css: `
                    .night-filter {
                        filter: brightness(0.6) saturate(0.7);
                        background: linear-gradient(to bottom, rgb(0 0 26 / 44%) 0%, rgb(0 0 81 / 44%) 100%);
                        transition: all 0.5s ease;
                    }
                `,
			},
			rain: {
				className: 'rain-filter',
				css: `
                    .rain-filter {
                        position: relative;
                        filter: brightness(0.9) saturate(0.9);
                        background: linear-gradient(to bottom, 
                            rgba(100,100,100,0.2) 0%,
                            rgba(50,50,50,0.4) 100%);
                    }
                    .rain-filter::before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: repeating-linear-gradient(transparent 0%,
                            rgba(155,155,155,0.3) 90%,
                            transparent 100%),
                            repeating-linear-gradient(90deg,
                            transparent 0%,
                            rgba(155,155,155,0.3) 90%,
                            transparent 100%);
                        background-size: 50px 50px;
                        animation: rain 0.5s linear infinite;
                        opacity: 0.5;
                    }
                    @keyframes rain {
                        0% { background-position: 0px 0px; }
                        100% { background-position: -50px 50px; }
                    }
                `,
			},
			snow: {
				className: 'snow-filter',
				css: `
                    .snow-filter {
                        filter: brightness(1.1) contrast(0.95);
                        background-color: rgba(255, 255, 255, 0.3);
                        transition: all 0.5s ease;
                    }
                    .snow-filter::before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(circle at 50% 50%,
                            rgba(255, 255, 255, 0.8) 0%,
                            rgba(255, 255, 255, 0) 60%);
                        background-size: 24px 24px;
                        animation: snow 8s linear infinite;
                        opacity: 0.4;
                    }
                    @keyframes snow {
                        0% { background-position: 0px 0px; }
                        100% { background-position: 24px 24px; }
                    }
                `,
			},
			fog: {
				className: 'fog-filter',
				css: `
                    .fog-filter {
                        filter: contrast(0.9) brightness(0.95);
                        background: linear-gradient(45deg,
                            rgba(255,255,255,0.4) 0%,
                            rgba(255,255,255,0.2) 100%);
                        transition: opacity 1s ease;
                    }
                    .fog-filter::before {
                        content: '';
                        position: absolute;
                        width: 200%;
                        height: 200%;
                        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                        opacity: 0.4;
                        animation: fog 20s linear infinite;
                        transform: scale(1.5);
                    }
                    @keyframes fog {
                        0% { transform: translate(0%, 0%) scale(1.5); }
                        100% { transform: translate(-50%, -50%) scale(1.5); }
                    }
                `,
			},
		};
		this.init();
	}

	init() {
		this._injectStyles();
		this._setupFilterContainer();
	}

	_injectStyles() {
		// Remove any existing styles first
		const existingStyle = document.getElementById('map-filter-styles');
		if (existingStyle) {
			existingStyle.remove();
		}

		const style = document.createElement('style');
		style.id = 'map-filter-styles';
		style.textContent = Object.values(this.filterStyles)
			.map((filter) => filter.css)
			.join('\n');
		document.head.appendChild(style);
	}

	_setupFilterContainer() {
		// Remove existing container if it exists
		const existingContainer = document.querySelector('.map-filter-container');
		if (existingContainer) {
			existingContainer.innerHTML = null;
		} else {
			const mapContainer = this.map.getContainer();
			const filterContainer = document.createElement('div');
			filterContainer.className = 'map-filter-container';
			filterContainer.style.cssText = `
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 400;
			`;
			mapContainer.appendChild(filterContainer);
			this.filterContainer = filterContainer;
		}
	}

	applyFilter(filter) {
		if (!filter || !filter.mode || !this.filterStyles[filter.mode]) {
			return;
		}

		const className = this.filterStyles[filter.mode].className;
		const existingFilter = this.filterContainer.querySelector(`.${className}`);

		if (filter.enabled) {
			if (!existingFilter) {
				const filterElement = document.createElement('div');
				filterElement.className = `map-filter ${className}`;
				filterElement.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `;
				this.filterContainer.appendChild(filterElement);

				// Force reflow before adding opacity
				filterElement.offsetHeight;
				filterElement.style.opacity = '1';

				this.activeFilters.add(filter.mode);
			}
		} else if (existingFilter) {
			existingFilter.style.opacity = '0';
			setTimeout(() => {
				if (existingFilter.parentNode) {
					existingFilter.remove();
				}
			}, 500);
			this.activeFilters.delete(filter.mode);
		}
	}

	removeFilter(mode) {
		const filterElement = this.filterContainer.querySelector(`.${this.filterStyles[mode].className}`);
		if (filterElement) {
			filterElement.style.opacity = '0';
			setTimeout(() => {
				if (filterElement.parentNode) {
					filterElement.remove();
				}
			}, 500);
			this.activeFilters.delete(mode);
		}
	}

	clearFilters() {
		const filters = this.filterContainer.querySelectorAll('.map-filter');
		filters.forEach((filter) => {
			filter.style.opacity = '0';
			setTimeout(() => {
				if (filter.parentNode) {
					filter.remove();
				}
			}, 500);
		});
		this.activeFilters.clear();
	}
}
