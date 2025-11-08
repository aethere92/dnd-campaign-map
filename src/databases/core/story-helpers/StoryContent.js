class StoryHelperContent {
	#placeholderProcessor;
	#getCampaign;
	#getCurrentSessionId;

	constructor(placeholderProcessor, getCampaign, getCurrentSessionId) {
		this.#placeholderProcessor = placeholderProcessor;
		this.#getCampaign = getCampaign;
		this.#getCurrentSessionId = getCurrentSessionId;
	}

	async renderSession(contentArea) {
		const campaign = this.#getCampaign();
		const sessionId = this.#getCurrentSessionId();

		if (!sessionId || !campaign.recaps) {
			contentArea.innerHTML = '<div class="no-content">Select a session to view its content.</div>';
			return;
		}

		const session = campaign.recaps.find((s) => s.id === sessionId);
		if (!session) {
			console.error(`Session not found: ${sessionId}`);
			contentArea.innerHTML = '<div class="no-content">Session not found. Please select another session.</div>';
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-view-container';

		const body = document.createElement('div');
		body.className = 'view-body';

		// Create list panel for TOC
		const listPanel = document.createElement('div');
		listPanel.className = 'view-list-panel';

		// Create detail panel for content
		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		// Create detail panel for content
		const detailContent = document.createElement('div');
		detailContent.className = 'view-detail-content';

		const header = this.#createSessionHeader(session);
		detailContent.appendChild(header);

		if (session.summary) {
			const recap = await this.#createRecapSection(session);
			detailContent.appendChild(recap);
		}

		const mainContent = await this.#createMainContent(session);
		detailContent.appendChild(mainContent);

		detailPanel.appendChild(detailContent);

		body.append(listPanel, detailPanel);
		container.appendChild(body);
		contentArea.appendChild(container);

		// Generate TOC in list panel after content is in DOM
		this.#generateTableOfContents(detailPanel, listPanel);

		// Scroll to hash if present
		setTimeout(() => {
			const hash = window.location.hash;
			if (hash) {
				const targetElement = document.getElementById(hash.substring(1));
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		}, 100);
	}

	#createSessionHeader(session) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const titleContainer = document.createElement('div');
		titleContainer.className = 'view-header-text';

		const title = document.createElement('h3');
		title.className = 'view-detail-name';
		title.id = 'session-title';
		title.textContent = session.title;

		titleContainer.appendChild(title);

		if (session.date) {
			const meta = document.createElement('div');
			meta.className = 'view-detail-meta';

			const date = document.createElement('span');
			date.className = 'view-meta-tag';
			date.textContent = session.date;

			meta.appendChild(date);
			titleContainer.appendChild(meta);
		}

		header.appendChild(titleContainer);
		return header;
	}

	async #createRecapSection(session) {
		const section = document.createElement('div');
		section.className = 'view-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Session Summary';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		const temp = document.createElement('div');
		temp.innerHTML = `${await this.#fetchAndParseMd(session.summary)}`;
		this.#placeholderProcessor.processAll(temp, session);

		content.appendChild(temp);
		section.append(header, content);
		return section;
	}

	async #createMainContent(session) {
		const main = document.createElement('div');
		main.className = 'session-main-content';

		const temp = document.createElement('div');
		temp.innerHTML = await this.#fetchAndParseMd(session.narrative);
		this.#placeholderProcessor.processAll(temp, session);

		main.appendChild(temp);
		return main;
	}

	async #fetchAndParseMd(filePath) {
		if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
			return filePath || '';
		}

		const campaign = this.#getCampaign();
		const basePath = `src/databases/data/campaigns/${campaign.id}/`;
		const fullPath = basePath + filePath;

		try {
			const response = await fetch(fullPath);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.text();
		} catch (error) {
			console.error(`Error fetching Markdown file "${fullPath}":`, error);
			return `<div class="error">Error loading content: ${error.message}</div>`;
		}
	}

	#generateTableOfContents(detailPanel, listPanel) {
		const mainContent = detailPanel.querySelector('.session-main-content');
		if (!mainContent) return;

		const headings = mainContent.querySelectorAll('h1, h2, h3, h4');
		if (headings.length === 0) {
			listPanel.style.display = 'none';
			return;
		}

		listPanel.innerHTML = '';

		// Create a single group for all headings
		const group = document.createElement('div');
		group.className = 'view-group';

		const groupContent = document.createElement('div');
		groupContent.className = 'view-group-content';

		const groupHeader = StoryDOMBuilder.createToggleHeader('On this page', groupContent);
		group.appendChild(groupHeader);

		headings.forEach((heading, index) => {
			if (!heading.id) {
				const slug = heading.textContent
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]+/g, '');
				heading.id = slug || `heading-${index}`;
			}

			const item = document.createElement('div');
			item.className = `view-list-item view-list-item-${heading.tagName.toLowerCase()}`;
			item.dataset.headingId = heading.id;

			const link = document.createElement('a');
			link.href = `#${heading.id}`;
			link.className = 'view-item-name';
			link.textContent = heading.textContent;

			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetElement = document.getElementById(heading.id);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
					history.replaceState(null, '', `#${heading.id}`);

					// Update selected state
					listPanel.querySelectorAll('.view-list-item').forEach((i) => i.classList.remove('selected'));
					item.classList.add('selected');
				}
			});

			item.appendChild(link);
			groupContent.appendChild(item);
		});

		group.appendChild(groupContent);
		listPanel.appendChild(group);

		// Add scroll spy functionality
		// this.#addScrollSpy(headings, listPanel);
	}

	// #addScrollSpy(headings, listPanel) {
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach((entry) => {
	// 				if (entry.isIntersecting) {
	// 					const id = entry.target.id;
	// 					const item = listPanel.querySelector(`[data-heading-id="${id}"]`);

	// 					if (item) {
	// 						// Remove selected class from all items
	// 						listPanel.querySelectorAll('.view-list-item').forEach((i) => {
	// 							i.classList.remove('selected');
	// 						});
	// 						// Add selected class to current item
	// 						item.classList.add('selected');

	// 						// Scroll item into view in the list panel
	// 						item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	// 					}
	// 				}
	// 			});
	// 		},
	// 		{
	// 			rootMargin: '-20% 0% -35% 0%',
	// 			threshold: [0, 1],
	// 		}
	// 	);

	// 	headings.forEach((heading) => {
	// 		observer.observe(heading);
	// 	});
	// }

	renderTimeline(contentArea) {
		const campaign = this.#getCampaign();
		const timelineRenderer = new StoryHelperTimeline(campaign, this.#placeholderProcessor);
		timelineRenderer.render(contentArea);
	}

	renderQuests(contentArea) {
		const campaign = this.#getCampaign();
		const questRenderer = new StoryHelperQuest(campaign, this.#placeholderProcessor);
		questRenderer.render(contentArea);
	}

	renderLocations(contentArea) {
		const campaign = this.#getCampaign();
		const locationRenderer = new StoryHelperLocation(campaign, this.#placeholderProcessor);
		locationRenderer.render(contentArea);
	}

	renderNPCs(contentArea) {
		const campaign = this.#getCampaign();
		const npcRenderer = new StoryHelperNPC(campaign, this.#placeholderProcessor);
		npcRenderer.render(contentArea);
	}

	renderFactions(contentArea) {
		const campaign = this.#getCampaign();
		const factionRenderer = new StoryHelperFaction(campaign, this.#placeholderProcessor);
		factionRenderer.render(contentArea);
	}

	renderEncounters(contentArea) {
		const campaign = this.#getCampaign();
		const encounterRenderer = new StoryHelperEncounter(campaign, this.#placeholderProcessor);
		encounterRenderer.render(contentArea);
	}

	// New: render the interactive map inside the story content area
	renderMap(contentArea) {
		const campaign = this.#getCampaign();
		if (!campaign?.data) {
			contentArea.innerHTML = '<div class="no-content">No map data available for this campaign.</div>';
			return;
		}

		// Wrapper to host the map element for layout within the story
		const container = document.createElement('div');
		container.className = 'story-view-container';

		const body = document.createElement('div');
		body.className = 'view-body';

		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		const detailContent = document.createElement('div');
		detailContent.className = 'view-detail-content';
		detailContent.style.padding = '0';

		// Move the existing #map element into this content area
		let mapEl = document.getElementById('map');
		if (!mapEl) {
			mapEl = document.createElement('div');
			mapEl.id = 'map';
		}

		// Ensure sizing fills available space
		Object.assign(mapEl.style, {
			width: '100%',
			height: '100%',
			display: 'block',
		});

		detailContent.appendChild(mapEl);
		detailPanel.appendChild(detailContent);
		body.append(detailPanel);
		container.appendChild(body);
		contentArea.appendChild(container);

		// Hide the top-level actions while inside story view
		const actions = document.getElementById('actions');
		if (actions) actions.style.display = 'none';

		// Initialize or update the CustomMap instance
		const defaultMapKey = this.#getCampaignDefaultMap(campaign);
		if (window.customMap && typeof window.customMap.updateCampaignData === 'function') {
			window.customMap.updateCampaignData(campaign.data);
			if (typeof window.customMap.loadMap === 'function' && defaultMapKey) {
				window.customMap.loadMap(defaultMapKey, false);
			}
			// Ensure proper sizing after DOM move
			const map = window.customMap.getCurrentMap?.();
			try {
				map && map.invalidateSize(true);
			} catch (_) {}
		} else {
			// Create a new instance bound to the #map element
			if (defaultMapKey) {
				// eslint-disable-next-line no-undef
				new CustomMap('map', {
					initialMapKey: defaultMapKey,
					campaignData: campaign.data,
					isDebugMode: false,
				});
			}
		}
	}

	renderCharacter(contentArea, characterName) {
		const campaign = this.#getCampaign();
		const characterRenderer = new StoryHelperCharacter(campaign, this.#placeholderProcessor);
		characterRenderer.render(contentArea, characterName);
	}

	// Local helper to compute default map key from campaign data
	#getCampaignDefaultMap(campaign) {
		if (campaign.defaultMap) return campaign.defaultMap;
		const data = campaign.data;
		if (!data) return null;
		const findFirstMap = (obj) => {
			if (!obj || typeof obj !== 'object') return null;
			for (const key in obj) {
				if (obj[key]?.image) return key;
				const result = findFirstMap(obj[key]);
				if (result) return `${key}.${result}`;
			}
			return null;
		};
		return findFirstMap(data);
	}
}
