class UrlManager {
	static getMapFromUrl() {
		return new URLSearchParams(window.location.search).get('map');
	}

	static updateUrl(mapKey, pushState = true, target = null) {
		// Create URL object to properly handle all parameters
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;

		// Preserve the campaign parameter if it exists
		const campaign = params.get('campaign');

		// Update map parameter
		params.set('map', mapKey);

		// Handle target if provided
		if (target) {
			// Simplified target format: type:id:lat,lng
			const targetStr = `${target.type}:${target.id}:${target.coordinates.join(',')}`;
			params.set('t', targetStr);
		} else {
			params.delete('t');
		}

		// Restore campaign parameter if it existed
		if (campaign) {
			params.set('campaign', campaign);
		}

		// Update URL
		if (pushState) {
			window.history.pushState({ mapKey, target, campaign }, '', `${window.location.pathname}?${params.toString()}`);
		} else {
			window.history.replaceState({ mapKey, target, campaign }, '', `${window.location.pathname}?${params.toString()}`);
		}
	}

	static getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		const mapKey = params.get('map');
		const campaign = params.get('campaign');
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

		return { mapKey, target, campaign };
	}

	static clearTarget(mapKey) {
		// Preserve campaign parameter when clearing target
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		const campaign = params.get('campaign');

		this.updateUrl(mapKey, true);

		if (campaign) {
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set('campaign', campaign);
			window.history.replaceState({ mapKey, campaign }, '', newUrl.toString());
		}
	}
}
