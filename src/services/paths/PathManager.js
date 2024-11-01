class PathManager {
	constructor(map, isDebugMode) {
		this.map = map;

		this.paths = [];
		this.pathLayer = null;
		this.isDebugMode = isDebugMode;

		this.pathMasterGroup = L.layerGroup();
		this.pathGroups = {};
		this.areaGroups = {};
		this.areaLayerGroup = L.layerGroup(); // New layer group for areas
	}

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

		// Hide controls if not in debug mode
		if (!this.isDebugMode) {
			this.map.pm.removeControls();
		}
	}

	_initializeGeomanEventListeners() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Line' || e.shape === 'Polygon') {
				const path = e.layer;
				const pathData = this._convertPathToData(path);

				console.log(path);
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
		// Add export button
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

	_convertPathToData(path) {
		const latlngs = path.getLatLngs();
		let points = [];

		if (Array.isArray(latlngs[0])) {
			// It's a polygon
			latlngs.forEach((ring) => {
				ring.forEach((latlng) => {
					points.push({
						coordinates: [latlng.lat, latlng.lng],
					});
				});
			});
		} else {
			// It's a line
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

		// Clear existing paths
		this.pathMasterGroup.clearLayers();
		this.pathGroups = {};

		this.paths.forEach((pathData, index) => {
			if (!pathData.points || !Array.isArray(pathData.points) || pathData.points.length < 2) {
				console.warn(`Invalid path data for path ${index}`);
				return;
			}

			let pathTextIndex = 0;
			const pathGroup = L.layerGroup();

			// Create segments between points
			for (let i = 0; i < pathData.points.length - 1; i++) {
				const startPoint = pathData.points[i];
				const endPoint = pathData.points[i + 1];

				// Determine segment color
				// Use point color if specified, otherwise use line color or default
				const segmentColor = startPoint.pointColor || endPoint.pointColor || pathData.lineColor || '#F15B50';

				const segment = L.polyline([startPoint.coordinates, endPoint.coordinates], {
					color: segmentColor,
					weight: 2,
					opacity: 0.9,
					dashArray: [5, 5],
					smoothFactor: 3,
				});
				pathGroup.addLayer(segment);

				// Add click handler for path segments
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

			// Add text markers if present
			pathData.points.forEach((point) => {
				if (point.text) {
					pathTextIndex++;
					const markerDot = L.marker(point.coordinates, {
						icon: L.divIcon({
							className: 'path-text-dot',
							html: `${pathTextIndex}`,
						}),
					}).bindPopup(point.text);

					markerDot.on('add', () => {
						const markerElement = markerDot.getElement();
						// Use point color if specified, otherwise use line color or default
						markerElement.style.backgroundColor = point.pointColor || pathData.lineColor || '#F15B50';
					});

					// Add click handler for text markers
					markerDot.on('click', () => {
						const target = {
							type: 'path',
							name: pathData.name,
							coordinates: point.coordinates,
							text: point.text,
						};
						UrlManager.updateUrl(this.map.customMap.getCurrentMapKey(), true, target);
					});

					pathGroup.addLayer(markerDot);
				}
			});

			this.pathGroups[pathData.name] = pathGroup;
			this.pathMasterGroup.addLayer(pathGroup);
		});

		// Add the master group to the map but don't display it
		this.pathMasterGroup.addTo(this.map);
		this.map.removeLayer(this.pathMasterGroup);

		this._createPathControls();
	}

	// New method to create Geoman areas
	createGeomanAreas(areas) {
		if (!Array.isArray(areas) || areas.length === 0) {
			console.warn('No valid area data provided');
			return;
		}

		areas.forEach((area) => {
			if (!area.points || !Array.isArray(area.points) || area.points.length < 3) {
				console.warn(`Invalid area data for area ${area.name}`);
				return;
			}

			const latlngs = area.points.map((point) => point.coordinates);
			const polygon = L.polygon(latlngs, {
				color: area.lineColor || 'transparent',
				fillColor: area.interiorColor || '#3388ff',
				fillOpacity: 0.5,
			}).addTo(this.map);

			// Add text in the middle of the polygon
			const center = polygon.getBounds().getCenter();
			const textMarker = L.marker(center, {
				icon: L.divIcon({
					className: 'polygon-text',
					html: `<span class="polygon-text" style="transform: rotate(${area?.textRotation ?? '0deg'}); font-size: ${
						area?.textSize ?? '10'
					}pt; font-family: var(--font-${area?.textFontType ?? 'description'});">${area.name}</span>`,
				}),
			}).addTo(this.map);

			this.areaGroups[area.name] = L.layerGroup([polygon, textMarker]);
			this.areaLayerGroup.addLayer(this.areaGroups[area.name]);

			// Add click handler for areas
			polygon.on('click', (e) => {
				const target = {
					type: 'area',
					id: area.name.toLowerCase().replace(/\s+/g, '_'),
					coordinates: [center.lat, center.lng],
				};
				UrlManager.updateUrl(this.map.customMap.getCurrentMapKey(), true, target);
				L.DomEvent.stopPropagation(e);
			});
		});

		this.areaLayerGroup.addTo(this.map);
		this.map.removeLayer(this.areaLayerGroup);
		this._createAreaControls();
	}

	_createAreaControls() {
		const areaControls = {};

		for (const [areaName, areaGroup] of Object.entries(this.areaGroups)) {
			areaControls[areaName] = areaGroup;
		}

		const layerControl = L.control.layers(null, areaControls, { collapsed: true }).addTo(this.map);
		const layerControlContainer = layerControl.getContainer();
		if (layerControlContainer) {
			layerControlContainer.classList.add('layer-group-areas');
		}
	}

	_createPathControls() {
		const pathControls = {};

		for (const [pathName, pathGroup] of Object.entries(this.pathGroups)) {
			pathControls[pathName] = pathGroup;
		}

		const layerControl = L.control.layers(null, pathControls, { collapsed: true }).addTo(this.map);
		const layerControlContainer = layerControl.getContainer();
		if (layerControlContainer) {
			layerControlContainer.classList.add('layer-group-overviews');
		}
	}

	_createPathControls() {
		// Add each path to the paths category
		Object.entries(this.pathGroups).forEach(([pathName, pathLayer]) => {
			this.map.customMap.updateLayerGroup('paths', `🛣️ ${pathName}`, pathLayer);
		});
	}

	_createAreaControls() {
		// Add each area to the areas category
		Object.entries(this.areaGroups).forEach(([areaName, areaLayer]) => {
			this.map.customMap.updateLayerGroup('areas', `📍 ${areaName}`, areaLayer);
		});
	}

	focusPath(target) {
		if (!target?.name) return;

		setTimeout(() => {
			const pathGroup = this.pathGroups[target.name];
			if (pathGroup) {
				// Make sure the path layer is visible
				this.pathMasterGroup.addTo(this.map);
				pathGroup.addTo(this.map);

				// Update layer control
				this.map.customMap.updateLayerGroup('paths', `🛣️ ${target.name}`, pathGroup);
			}
		}, 100);
	}

	focusArea(target) {
		if (!target?.name) return;

		setTimeout(() => {
			const areaGroup = this.areaGroups[target.name];
			if (areaGroup) {
				// Make sure the area layer is visible
				this.areaLayerGroup.addTo(this.map);
				areaGroup.addTo(this.map);

				// Update layer control
				this.map.customMap.updateLayerGroup('areas', `📍 ${target.name}`, areaGroup);
			}
		}, 100);
	}
}
