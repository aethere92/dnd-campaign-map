class StoryHelperLocation extends StoryHelperBase {
	getUrlParam() {
		return 'location';
	}

	async getItems() {
		// Try Supabase first, fallback to campaign data
		if (this.supabaseClient?.isReady()) {
			try {
				// Fetch locations with all related data in one query
				const locations = await Promise.race([
					this.supabaseClient.fetchLocationsWithRelations(this.campaign.id),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
				]);
				if (locations && locations.length > 0) {
					// Transform the normalized data back to the format the UI expects
					return this.transformLocationsFromSupabase(locations);
				}
			} catch (error) {
				console.warn('Failed to fetch Locations from Supabase, using local data:', error);
			}
		}

		// Fallback to local data
		return this.campaign?.locations || [];
	}

	/**
	 * Transform normalized Supabase data into the format expected by the UI
	 */
	transformLocationsFromSupabase(locations) {
		return locations.map((location) => ({
			...location,
			// Transform arrays from junction tables
			threats: location.threats?.map((t) => t.threat) || [],
			features: location.features?.map((f) => f.feature) || [],
			connections: location.connections?.map((c) => c.connected_location_id || c.connection_type) || [],
			npcs: location.npcs?.map((n) => n.npc_id) || [],
		}));
	}

	getViewTitle() {
		return 'Locations';
	}

	getItemId(location) {
		return location.id || location.name;
	}

	groupItems(locations) {
		// Separate top-level locations from nested ones
		const topLevel = locations.filter((loc) => !loc.parent);
		const nested = locations.filter((loc) => loc.parent);

		// Create a map for quick parent lookup
		const nestedByParent = {};
		nested.forEach((loc) => {
			if (!nestedByParent[loc.parent]) {
				nestedByParent[loc.parent] = [];
			}
			nestedByParent[loc.parent].push(loc);
		});

		// Group top-level locations by type
		const grouped = {};
		topLevel.forEach((location) => {
			const type = location.type || 'Other';
			if (!grouped[type]) {
				grouped[type] = [];
			}

			// Store the location with its children
			grouped[type].push({
				...location,
				children: nestedByParent[location.id] || [],
			});
		});

		// Sort each group and children alphabetically
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => a.name.localeCompare(b.name));
			group.forEach((loc) => {
				if (loc.children?.length) {
					loc.children.sort((a, b) => a.name.localeCompare(b.name));
				}
			});
		});

		// Format group names
		const formatted = {};
		Object.entries(grouped).forEach(([type, locs]) => {
			formatted[this.formatName(type)] = locs;
		});

		return formatted;
	}

	renderGroups(container, groupedLocations, detailPanel) {
		// Override to handle nested structure
		Object.entries(groupedLocations).forEach(([typeName, locations]) => {
			this.renderNestedGroup(container, typeName, locations, detailPanel);
		});
	}

	renderNestedGroup(container, typeName, locations, detailPanel) {
		const typeGroup = document.createElement('div');
		typeGroup.className = 'view-group view-group-level-1';

		const typeContent = document.createElement('div');
		typeContent.className = 'view-group-content';

		const typeHeader = StoryDOMBuilder.createToggleHeader(typeName, typeContent);
		typeGroup.appendChild(typeHeader);

		locations.forEach((location) => {
			// Add the parent location
			const locationItem = this.createListItem(location, detailPanel);
			typeContent.appendChild(locationItem);

			// Add children if they exist
			if (location.children?.length) {
				const childrenContainer = document.createElement('div');
				childrenContainer.className = 'view-group view-group-level-2';

				const childrenContent = document.createElement('div');
				childrenContent.className = 'view-group-content';

				location.children.forEach((child) => {
					const childItem = this.createListItem(child, detailPanel);
					childItem.classList.add('view-list-item-nested');
					childrenContent.appendChild(childItem);
				});

				childrenContainer.appendChild(childrenContent);
				typeContent.appendChild(childrenContainer);
			}
		});

		typeGroup.appendChild(typeContent);
		container.appendChild(typeGroup);
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

		// Show region from location or inherit from parent
		let region = location.region;
		if (!region && location.parent) {
			const parentLoc = this.campaign.locations.find((l) => l.id === location.parent);
			region = parentLoc?.region;
		}
		if (region) {
			metaTags.push({ className: 'location-region', text: region });
		}

		// Show parent location if nested
		if (location.parent) {
			const parentLoc = this.campaign.locations.find((l) => l.id === location.parent);
			if (parentLoc) {
				metaTags.push({
					className: 'location-parent',
					text: `In ${parentLoc.name}`,
				});
			}
		}

		header.appendChild(name);
		if (metaTags.length) {
			header.appendChild(this.createMetaTags(metaTags));
		}
		detail.appendChild(header);

		// Show children if this is a parent location
		const children = this.campaign.locations.filter((l) => l.parent === location.id);
		if (children.length) {
			const childNames = children.map((c) => c.name);
			detail.appendChild(this.createListSection('Structures & Sublocations', childNames));
		}

		// Description
		if (location.description) {
			detail.appendChild(this.createSection('Description', location.description));
		}

		// Notable features
		if (location.features?.length) {
			detail.appendChild(this.createListSection('Notable Features', location.features));
		}

		// Additional fields based on type
		if (location.population) {
			detail.appendChild(this.createSection('Population', location.population));
		}

		if (location.ruler) {
			detail.appendChild(this.createSection('Ruler', location.ruler));
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
