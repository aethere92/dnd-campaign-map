class MapFilterManager {
	constructor(map) {
		this.map = map;
		this.activeFilters = new Map();
		this.filterElement = this._createFilterElement();
		this.filterLayers = new Map();
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

	_parseFilterName(filterName) {
		// Parse filter string (e.g., "night-50" -> { base: "night", intensity: 50 })
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

		// Apply intensity through opacity
		const intensity = parsed.intensity / 100;
		layer.style.setProperty('--filter-intensity', intensity);

		// Store the parsed data for later reference
		this.activeFilters.set(filterName, {
			base: parsed.base,
			intensity: parsed.intensity,
		});

		return layer;
	}

	setFilters(filters) {
		const filterArray = Array.isArray(filters) ? filters : [filters];

		// Remove filters that are no longer active
		for (const [existingFilter] of this.filterLayers) {
			if (!filterArray.includes(existingFilter)) {
				this.filterLayers.get(existingFilter).remove();
				this.filterLayers.delete(existingFilter);
				this.activeFilters.delete(existingFilter);
			}
		}

		// Add or update new filters
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

	updateFilterIntensity(filterName, intensity) {
		const layer = this.filterLayers.get(filterName);
		if (layer) {
			layer.style.setProperty('--filter-intensity', intensity / 100);

			// Update stored data
			const parsed = this._parseFilterName(filterName);
			if (parsed) {
				this.activeFilters.set(filterName, {
					...parsed,
					intensity: intensity,
				});
			}
		}
	}

	clearFilters() {
		this.filterLayers.forEach((layer) => layer.remove());
		this.filterLayers.clear();
		this.activeFilters.clear();
	}

	destroy() {
		this.clearFilters();
		this.filterElement.remove();
	}
}
