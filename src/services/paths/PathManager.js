class PathManager {
	constructor(map, isDebugMode) {
		this.map = map;

		this.paths = [];
		this.pathLayer = null;
		this.isDebugMode = isDebugMode;

		this.pathMasterGroup = L.layerGroup();
		this.pathGroups = {};
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
			drawMarker: false,
			drawCircleMarker: false,
			drawPolygon: false,
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
			if (e.shape === 'Line') {
				const path = e.layer;
				const pathData = this._convertPathToData(path);
				this.paths.push(pathData);
			}
		});

		this.map.on('pm:remove', (e) => {
			if (e.shape === 'Line') {
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
			if (e.shape === 'Line') {
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
		return {
			name: `Path ${this.paths.length + 1}`,
			points: latlngs.map((latlng) => ({
				coordinates: [latlng.lat, latlng.lng],
			})),
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
			const latlngs = pathData.points.map((point) => point.coordinates);
			const path = L.polyline(latlngs, {
				color: pathData?.lineColor || '#F15B50',
				weight: 2,
				opacity: 0.9,
				dashArray: [5, 5],
				smoothFactor: 3,
			});
			pathGroup.addLayer(path);

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
						markerElement.style.backgroundColor = pathData?.lineColor ?? '#F15B50';
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
}
