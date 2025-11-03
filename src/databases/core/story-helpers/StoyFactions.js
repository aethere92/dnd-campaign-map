class StoryHelperFaction extends StoryHelperBase {
    getUrlParam() {
		return 'faction'; // URL: ?faction=arcane-brotherhood
	}

    getItems() {
		return this.campaign?.factions;
	}

    getViewTitle() {
		return 'Factions';
	}

	getItemId(faction) {
		return faction.id || faction.name;
	}

	groupItems(factions) {
		const grouped = {};

		factions.forEach((faction) => {
			const type = faction.type || 'Other';
			if (!grouped[type]) {
				grouped[type] = [];
			}
			grouped[type].push(faction);
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

    createDetailContent(faction) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		// Header
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = faction.name;

		const metaTags = [];
		if (faction.type) {
			metaTags.push({ className: 'faction-type', text: this.formatName(faction.type) });
		}
		if (faction.location) {
			metaTags.push({ className: 'faction-location', text: `${faction.location}${faction?.sublocation ?? null}`});
		}

		header.appendChild(name);
		if (metaTags.length) {
			header.appendChild(this.createMetaTags(metaTags));
		}
		detail.appendChild(header);

		// Description
		if (faction.leader) {
			detail.appendChild(this.createSection('Leader', faction.leader));
		}

		// Description
		if (faction.description) {
			detail.appendChild(this.createSection('Description', faction.description));
		}

		// NPCs
		if (faction.npcs?.length) {
			const npcItems = faction.npcs.map((npc) =>
				typeof npc === 'string' ? npc : `${npc.name}${npc.role ? ` - ${npc.role}` : ''}`
			);
			detail.appendChild(this.createListSection('Notable NPCs', npcItems));
		}

        // Encounters
        if (faction.encounters?.length) {
			detail.appendChild(this.createEncountersSection(faction.encounters));
		}

		return detail;
	}

    createEncountersSection(encounters) {
		const content = document.createElement('div');
		content.className = 'view-encounters';

		encounters.forEach((encounter) => {
			const card = document.createElement('div');
			card.className = 'view-card';

			if (encounter.session) {
				const sessionLabel = document.createElement('div');
				sessionLabel.className = 'view-card-label';
				sessionLabel.textContent = `Session ${encounter.session}`;
				card.appendChild(sessionLabel);
			}

			if (encounter.description) {
				const desc = document.createElement('p');
				desc.className = 'view-card-text';
				desc.textContent = encounter.description;
				this.placeholderProcessor.processEntityReferences(desc);
				card.appendChild(desc);
			}

			content.appendChild(card);
		});

		return this.createSection('Party Encounters', content);
	}
}