class MapFilterManager {
	constructor(map) {
		this.map = map;
		this.activeFilters = new Map();
		this.filterElement = this._createFilterElement();
		this.filterLayers = new Map();
		this.lightsContainer = this._createLightsContainer();
		this.activeLights = new Map(); // Tracks active light elements
	}

	_createFilterElement() {
		const element = document.createElement('div');
		element.className = 'map-filter-container';
		Object.assign(element.style, {
			position: 'absolute',
			inset: '0',
			pointerEvents: 'none',
			zIndex: '400',
		});
		this.map.getContainer().appendChild(element);
		return element;
	}

	_createLightsContainer() {
		const container = document.createElement('div');
		container.className = 'map-lights-container';
		Object.assign(container.style, {
			position: 'absolute',
			inset: '0',
			pointerEvents: 'none',
			zIndex: '401',
		});
		this.map.getContainer().appendChild(container);
		return container;
	}

	_createLight(coordinates, intensity = 1, radius = 60, type = 'warm') {
		const light = document.createElement('div');
		light.className = `map-light map-light-${type}`;

		const point = this.map.latLngToContainerPoint(coordinates);

		Object.assign(light.style, {
			position: 'absolute',
			left: `${point.x}px`,
			top: `${point.y}px`,
			width: `${radius}px`,
			height: `${radius}px`,
			transform: 'translate(-50%, -50%)',
			opacity: intensity,
		});

		return light;
	}

	_updateLightPosition(light, coordinates) {
		const point = this.map.latLngToContainerPoint(coordinates);
		light.style.left = `${point.x}px`;
		light.style.top = `${point.y}px`;
	}

	updateLights(lightConfig) {
		if (!lightConfig) {
			// Remove all lights if lightConfig is null
			this.clearLights();
			return;
		}

		const { intensity = 1, coordinates = [], radius = 60, type = 'warm' } = lightConfig;

		// Create a set of coordinate strings for comparison
		const newCoordinatesSet = new Set(coordinates.map((coord) => coord.join(',')));

		// Remove lights that are no longer in the coordinates list
		for (const [coordString, light] of this.activeLights.entries()) {
			if (!newCoordinatesSet.has(coordString)) {
				light.element.remove();
				this.activeLights.delete(coordString);
				if (light.moveListener) {
					this.map.off('move', light.moveListener);
				}
			}
		}

		// Add or update lights
		coordinates.forEach((coord) => {
			const coordString = coord.join(',');

			if (!this.activeLights.has(coordString)) {
				// Create new light
				const lightElement = this._createLight(coord, intensity, radius, type);
				this.lightsContainer.appendChild(lightElement);

				// Create move listener
				const moveListener = () => {
					this._updateLightPosition(lightElement, coord);
				};

				this.map.on('move', moveListener);

				this.activeLights.set(coordString, {
					element: lightElement,
					coordinates: coord,
					moveListener,
				});
			} else {
				// Update existing light's intensity
				const light = this.activeLights.get(coordString);
				light.element.style.opacity = intensity;
			}
		});
	}

	clearLights() {
		for (const [_, light] of this.activeLights) {
			light.element.remove();
			if (light.moveListener) {
				this.map.off('move', light.moveListener);
			}
		}
		this.activeLights.clear();
	}

	// Your existing filter methods remain the same...
	_parseFilterName(filterName) {
		const match = filterName.match(/^([a-zA-Z]+)(?:-(\d+))?$/);
		if (!match) return null;

		return {
			base: match[1],
			intensity: match[2] ? parseInt(match[2]) : 100,
		};
	}

	_createFilterLayer(filterName) {
		const parsed = this._parseFilterName(filterName);
		if (!parsed) return null;

		const layer = document.createElement('div');
		layer.className = `map-filter map-filter-${parsed.base}`;
		layer.style.setProperty('--filter-intensity', parsed.intensity / 100);
		this.activeFilters.set(filterName, {
			base: parsed.base,
			intensity: parsed.intensity,
		});

		return layer;
	}

	setFilters(filters) {
		const filterArray = Array.isArray(filters) ? filters : [filters];

		for (const [existingFilter] of this.filterLayers) {
			if (!filterArray.includes(existingFilter)) {
				this.filterLayers.get(existingFilter).remove();
				this.filterLayers.delete(existingFilter);
				this.activeFilters.delete(existingFilter);
			}
		}

		filterArray.forEach((filter) => {
			if (!this.filterLayers.has(filter)) {
				const layer = this._createFilterLayer(filter);
				if (layer) {
					this.filterElement.appendChild(layer);
					this.filterLayers.set(filter, layer);
				}
			}
		});
	}

	clearFilters() {
		this.filterLayers.forEach((layer) => layer.remove());
		this.filterLayers.clear();
		this.activeFilters.clear();
	}

	destroy() {
		this.clearFilters();
		this.clearLights();
		this.filterElement.remove();
		this.lightsContainer.remove();
	}
}
