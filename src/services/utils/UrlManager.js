// Helper Classes
class UrlManager {
	static getMapFromUrl() {
		return new URLSearchParams(window.location.search).get('map');
	}

	static updateUrl(mapKey, pushState = true, target = null) {
		let url = `?map=${mapKey}`;

		if (target) {
			// Simplified target format: type:id:lat,lng
			// Example: marker:cities.baldurs_gate:-167.34,210.40
			const targetStr = `${target.type}:${target.id}:${target.coordinates.join(',')}`;
			url += `&t=${targetStr}`;
		}

		if (pushState) {
			window.history.pushState({ mapKey, target }, '', url);
		} else {
			window.history.replaceState({ mapKey, target }, '', url);
		}
	}

	static getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		const mapKey = params.get('map');
		const targetStr = params.get('t');

		let target = null;
		if (targetStr) {
			try {
				const [type, id, coords] = targetStr.split(':');
				const [lat, lng] = coords.split(',').map(Number);

				target = {
					type,
					id,
					coordinates: [lat, lng],
				};
			} catch (e) {
				console.error('Failed to parse target from URL:', e);
			}
		}

		return { mapKey, target };
	}

	static clearTarget(mapKey) {
		this.updateUrl(mapKey, true);
	}
}
