class SidebarService {
	constructor(map) {
		this.map = map;
		this.markers = {};
	}

	init() {
		const { layerGroups } = this.map;
		const log = this._getAllMarkers(layerGroups);
	}

	_getAllMarkers(layerGroups) {
		if (!layerGroups) return [];
		const markers = [];

		Object.entries(layerGroups).forEach(([key, entry]) => {
			if (entry.group && entry.group.getLayers) {
				entry.group.getLayers().forEach((subEntry) => {
					if (subEntry instanceof L.Marker) {
						markers.push(subEntry);
					} else if (subEntry instanceof L.LayerGroup) {
						markers.push(...this._getAllMarkers({ [key]: { group: subEntry } }));
					}
				});
			}
		});

		return markers;
	}
}
