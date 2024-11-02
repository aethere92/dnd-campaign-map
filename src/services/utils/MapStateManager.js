class MapStateManager {
	#state;

	constructor() {
		this.#state = {
			zoom: null,
			center: null,
			bounds: null,
		};
	}

	saveState(map) {
		this.#state = {
			zoom: map.getZoom(),
			center: map.getCenter(),
			bounds: map.getBounds(),
		};
	}

	restoreState(map) {
		if (this.#state.center && this.#state.zoom) {
			map.setView(this.#state.center, this.#state.zoom);
		}
	}
}
