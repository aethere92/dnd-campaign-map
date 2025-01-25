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

				let mapButton = '';

				if (point.map) {
					const exitObject = point?.map?.exitCoordinates
						? { exitCoordinates: point?.map?.exitCoordinates, exitZoom: point?.map?.exitZoom || 2 }
						: null;
					mapButton = `<button class="marker-nav-btn" style="margin-top: 2px;" onclick='customMap.loadMap("${
						point.map.name
					}", true, ${JSON.stringify(exitObject)})'>Next step is on another map - view map</button>`;
				}

				const popupContent = `
                    <div class="marker-popup-content">
                        <div class="marker-text">${point.text}</div>
						${mapButton}
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
					markerElement.style.color = point?.textColor || '#FFFFFF';
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
