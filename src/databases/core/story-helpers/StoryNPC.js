class StoryHelperNPC extends StoryHelperBase {
	getUrlParam() {
		return 'npc';
	}

	async getItems() {
		// Try Supabase first, fallback to campaign data
		if (this.supabaseClient?.isReady()) {
			try {
				const npcs = await Promise.race([
					this.supabaseClient.fetchNPCs(this.campaign.id),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
				]);

				if (npcs && npcs.length > 0) {
					return npcs;
				}
			} catch (error) {
				console.warn('Failed to fetch NPCs from Supabase, using local data:', error);
			}
		}
		// Fallback to local data
		return this.campaign?.npcs || [];
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
			const location = this.processEntityReference(npc.location?.primary || 'Unknown Location');

			if (!grouped[affinity]) {
				grouped[affinity] = {};
			}
			if (!grouped[affinity][location]) {
				grouped[affinity][location] = [];
			}

			grouped[affinity][location].push(npc);
		});

		Object.values(grouped).forEach((locations) => {
			Object.values(locations).forEach((npcList) => {
				npcList.sort((a, b) => a.name.localeCompare(b.name));
			});
		});

		return grouped;
	}

	renderGroups(container, groupedNPCs, detailPanel) {
		Object.entries(groupedNPCs).forEach(([affinity, locations]) => {
			this.renderNestedGroup(container, affinity, locations, detailPanel);
		});
	}

	renderNestedGroup(container, affinity, locations, detailPanel) {
		const affinityGroup = document.createElement('div');
		affinityGroup.className = 'view-group view-group-level-1';

		const affinityContent = document.createElement('div');
		affinityContent.className = 'view-group-content';

		const affinityHeader = this.createNestedGroupHeader(affinity, affinityContent, 'view-group-header-level-1');
		affinityGroup.appendChild(affinityHeader);

		Object.entries(locations).forEach(([location, npcList]) => {
			const locationGroup = document.createElement('div');
			locationGroup.className = 'view-group view-group-level-2';

			const locationContent = document.createElement('div');
			locationContent.className = 'view-group-content';

			const locationHeader = this.createNestedGroupHeader(location, locationContent, 'view-group-header-level-2');
			locationGroup.appendChild(locationHeader);

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

		const toggleGroup = () => {
			const isCurrentlyExpanded = contentElement.style.display !== 'none';
			contentElement.style.display = isCurrentlyExpanded ? 'none' : 'block';
			toggleButton.setAttribute('aria-expanded', !isCurrentlyExpanded);
			toggleButton.querySelector('.toggle-icon').textContent = isCurrentlyExpanded ? '▶' : '▼';
		};

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

		container.append(name);
		return container;
	}

	createDetailContent(npc) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

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
			detail.appendChild(this.createListSection('Involved In', npc.link));
		}

		return detail;
	}

	createRelationshipsSection(relationships) {
		const content = document.createElement('div');
		content.className = 'view-relationships';

		relationships.forEach((rel) => {
			const relDiv = document.createElement('div');
			relDiv.className = 'view-relationship-item';

			const relatedNPC = this.campaign.npcs?.find((n) => n.id === rel.npcId);
			const relatedCharacter = this.campaign.metadata?.characters?.find((n) => n.name.toLowerCase() === rel.npcId);
			const npcName = relatedNPC ? relatedNPC.name : relatedCharacter ? relatedCharacter.name : 'Unknown NPC';

			relDiv.innerHTML = `<span class="entity-reference entity-npc" data-entity-type="npc" data-entity-name="${npcName}">${npcName}</span>: ${
				rel.type
			}${rel.description ? ` - ${rel.description}` : ''}`;
			// relDiv.innerHTML = `<strong>${npcName}</strong>: ${rel.type}${rel.description ? ` - ${rel.description}` : ''}`;
			// this.placeholderProcessor.processEntityReferences(relDiv);
			content.appendChild(relDiv);
		});

		return this.createSection('Relationships', content);
	}
}
