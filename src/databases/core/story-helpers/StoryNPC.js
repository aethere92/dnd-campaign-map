class StoryHelperNPC extends StoryHelperBase {
	getUrlParam() {
		return 'npc'; // URL: ?npc=npc_001
	}

	getItems() {
		return this.campaign?.npcs;
	}

	getViewTitle() {
		return 'NPCs';
	}

	getItemId(npc) {
		return npc.id;
	}

	groupItems(npcs) {
		const grouped = {};

		npcs.forEach((npc) => {
			const affinity = npc.affinity || 'Unknown';
			const location = npc.location?.primary || 'Unknown Location';
			const faction = npc.faction || 'No Faction';

			// Create nested structure: affinity > location > faction
			if (!grouped[affinity]) {
				grouped[affinity] = {};
			}
			if (!grouped[affinity][location]) {
				grouped[affinity][location] = [];
			}

			grouped[affinity][location].push(npc);
		});

		// Sort NPCs within each faction group alphabetically
		Object.values(grouped).forEach((locations) => {
			Object.values(locations).forEach((npcList) => {
				npcList.sort((a, b) => a.name.localeCompare(b.name));
			});
		});

		return grouped;
	}

	renderGroups(container, groupedNPCs, detailPanel) {
		// Override to handle nested structure
		Object.entries(groupedNPCs).forEach(([affinity, locations]) => {
			this.renderNestedGroup(container, affinity, locations, detailPanel);
		});
	}

	renderNestedGroup(container, affinity, locations, detailPanel) {
		const affinityGroup = document.createElement('div');
		affinityGroup.className = 'view-group view-group-level-1';

		// Create content wrapper for level 1 toggle
		const affinityContent = document.createElement('div');
		affinityContent.className = 'view-group-content';

		const affinityHeader = this.createNestedGroupHeader(affinity, affinityContent, 'view-group-header-level-1');
		affinityGroup.appendChild(affinityHeader);

		// Iterate through locations
		Object.entries(locations).forEach(([location, npcList]) => {
			const locationGroup = document.createElement('div');
			locationGroup.className = 'view-group view-group-level-2';

			// Create content wrapper for level 2 toggle
			const locationContent = document.createElement('div');
			locationContent.className = 'view-group-content';

			const locationHeader = this.createNestedGroupHeader(location, locationContent, 'view-group-header-level-2');
			locationGroup.appendChild(locationHeader);

			// Add NPCs to location content
			npcList.forEach((npc) => {
				const npcItem = this.createListItem(npc, detailPanel);
				locationContent.appendChild(npcItem);
			});

			locationGroup.appendChild(locationContent);
			affinityContent.appendChild(locationGroup);
		});

		affinityGroup.appendChild(affinityContent);
		container.appendChild(affinityGroup);
	}

	// Create a nested group header with toggle functionality
	createNestedGroupHeader(groupName, contentElement, headerClass) {
		const groupHeader = document.createElement('div');
		groupHeader.className = `view-group-header ${headerClass}`;

		const titleElement = document.createElement('span');
		titleElement.className = 'view-group-header-title';
		titleElement.textContent = groupName;

		const toggleButton = document.createElement('button');
		toggleButton.className = 'view-group-toggle';
		toggleButton.setAttribute('aria-expanded', 'true');
		toggleButton.setAttribute('aria-label', `Toggle ${groupName} group`);
		toggleButton.innerHTML = '<span class="toggle-icon">▼</span>';

		// Toggle function
		const toggleGroup = () => {
			const isCurrentlyExpanded = contentElement.style.display !== 'none';

			contentElement.style.display = isCurrentlyExpanded ? 'none' : 'block';
			toggleButton.setAttribute('aria-expanded', !isCurrentlyExpanded);
			toggleButton.querySelector('.toggle-icon').textContent = isCurrentlyExpanded ? '▶' : '▼';
		};

		// Make both button and header clickable
		toggleButton.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleGroup();
		});

		titleElement.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleGroup();
		});

		groupHeader.append(titleElement, toggleButton);
		return groupHeader;
	}

	createListItem(npc, detailPanel) {
		const item = super.createListItem(npc, detailPanel);

		if (npc.status) {
			item.classList.add(`status-${npc.status.toLowerCase()}`);
		}

		return item;
	}

	createListItemContent(npc) {
		const container = document.createElement('div');

		const name = document.createElement('span');
		name.className = 'view-item-name';
		name.textContent = npc.name;

		const role = document.createElement('span');
		role.className = 'view-item-subtitle';
		role.textContent = npc.role || '';

		container.append(name, role);
		return container;
	}

	createDetailContent(npc) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		// Header
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		if (npc.portrait) {
			const portrait = document.createElement('img');
			portrait.src = npc.portrait;
			portrait.alt = npc.name;
			portrait.className = 'view-portrait';
			header.appendChild(portrait);
		}

		const headerText = document.createElement('div');
		headerText.className = 'view-header-text';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = npc.name;

		const metaTags = [];
		if (npc.race || npc.class) {
			const parts = [];
			if (npc.race) parts.push(npc.race);
			if (npc.class) parts.push(npc.class);
			metaTags.push({ className: 'npc-race-class', text: parts.join(' ') });
		}
		if (npc.role) metaTags.push({ className: 'npc-role', text: npc.role });
		if (npc.faction) metaTags.push({ className: 'npc-faction', text: npc.faction });
		if (npc.affinity) metaTags.push({ className: 'npc-affinity', text: npc.affinity });
		if (npc.status) {
			metaTags.push({ className: `npc-status status-${npc.status.toLowerCase()}`, text: npc.status });
		}

		headerText.appendChild(name);
		if (metaTags.length) {
			headerText.appendChild(this.createMetaTags(metaTags));
		}

		header.appendChild(headerText);
		detail.appendChild(header);

		// Sections
		if (npc.description) {
			detail.appendChild(this.createSection('Description', npc.description));
		}

		if (npc.personality) {
			detail.appendChild(this.createSection('Personality', npc.personality));
		}

		if (npc.background) {
			detail.appendChild(this.createSection('Background', npc.background));
		}

		if (npc.location?.primary) {
			let locationText = npc.location.primary;
			if (npc.location.specific) {
				locationText += ` - ${npc.location.specific}`;
			}
			detail.appendChild(this.createSection('Location', locationText));
		}

		if (npc.goals?.length) {
			detail.appendChild(this.createListSection('Goals & Motivations', npc.goals));
		}

		if (npc.relationships?.length) {
			detail.appendChild(this.createRelationshipsSection(npc.relationships));
		}

		if (npc.items?.length) {
			detail.appendChild(this.createListSection('Notable Items', npc.items));
		}

		if (npc.encounters?.length) {
			detail.appendChild(this.createEncountersSection(npc.encounters));
		}

		if (npc.link?.length) {
			detail.appendChild(this.createLinksSection(npc.link));
		}

		return detail;
	}

	createRelationshipsSection(relationships) {
		const content = document.createElement('div');
		content.className = 'view-relationships';

		relationships.forEach((rel) => {
			const relDiv = document.createElement('div');
			relDiv.className = 'view-relationship-item';

			const relatedNPC = this.campaign.npcs.find((n) => n.id === rel.npcId);
			const relatedCharacter = this.campaign.metadata.characters.find((n) => n.name.toLowerCase() === rel.npcId);
			const npcName = relatedNPC ? relatedNPC.name : relatedCharacter ? relatedCharacter.name : 'Unknown NPC';

			relDiv.innerHTML = `<strong>${npcName}</strong>: ${rel.type}${rel.description ? ` - ${rel.description}` : ''}`;
			this.placeholderProcessor.processEntityReferences(relDiv);
			content.appendChild(relDiv);
		});

		return this.createSection('Relationships', content);
	}
}
