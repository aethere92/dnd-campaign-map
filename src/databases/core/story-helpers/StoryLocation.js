class StoryHelperLocation extends StoryHelperBase {
	getUrlParam() {
		return 'location'; // URL: ?location=tavern-of-the-broken-shield
	}

	getItems() {
		return this.campaign?.locations;
	}

	getViewTitle() {
		return 'Locations';
	}

	getItemId(location) {
		return location.id || location.name;
	}

	groupItems(locations) {
		const grouped = {};

		locations.forEach((location) => {
			const type = location.type || 'Other';
			if (!grouped[type]) {
				grouped[type] = [];
			}
			grouped[type].push(location);
		});

		// Sort each group alphabetically
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => a.name.localeCompare(b.name));
		});

		// Format group names
		const formatted = {};
		Object.entries(grouped).forEach(([type, locs]) => {
			formatted[this.formatName(type)] = locs;
		});

		return formatted;
	}

	createDetailContent(location) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		// Header
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = location.name;

		const metaTags = [];
		if (location.type) {
			metaTags.push({ className: 'location-type', text: this.formatName(location.type) });
		}
		if (location.region) {
			metaTags.push({ className: 'location-region', text: location.region });
		}

		header.appendChild(name);
		if (metaTags.length) {
			header.appendChild(this.createMetaTags(metaTags));
		}
		detail.appendChild(header);

		// Description
		if (location.description) {
			detail.appendChild(this.createSection('Description', location.description));
		}

		// Notable features
		if (location.features?.length) {
			detail.appendChild(this.createListSection('Notable Features', location.features));
		}

		// NPCs
		if (location.npcs?.length) {
			const npcItems = location.npcs.map((npc) =>
				typeof npc === 'string' ? npc : `${npc.name}${npc.role ? ` - ${npc.role}` : ''}`
			);
			detail.appendChild(this.createListSection('Notable NPCs', npcItems));
		}

		// Connections
		if (location.connections?.length) {
			detail.appendChild(this.createListSection('Connected Locations', location.connections));
		}

		// Threats
		if (location.threats?.length) {
			detail.appendChild(this.createListSection('Threats', location.threats));
		}

		// History
		if (location.history) {
			detail.appendChild(this.createSection('History & Lore', location.history));
		}

		return detail;
	}
}
