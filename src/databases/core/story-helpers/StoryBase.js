class StoryHelperBase {
	#campaign;
	#placeholderProcessor;
	#selectedItemId = null;
	#listPanel = null;
	#storyUrlManager;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
		this.#storyUrlManager = new StoryURLManager();
	}

	// Abstract methods - must be implemented by subclasses
	getItems() {
		throw new Error('getItems() must be implemented by subclass');
	}

	getViewTitle() {
		throw new Error('getViewTitle() must be implemented by subclass');
	}

	groupItems(items) {
		throw new Error('groupItems() must be implemented by subclass');
	}

	createDetailContent(item) {
		throw new Error('createDetailContent() must be implemented by subclass');
	}

	getItemId(item) {
		throw new Error('getItemId() must be implemented by subclass');
	}

	getUrlParam() {
		throw new Error('getUrlParam() must be implemented by subclass');
	}

	// URL management methods
	getTargetFromUrl() {
		return this.#storyUrlManager.getParam(this.getUrlParam());
	}

	updateUrl(itemId) {
		const params = this.#storyUrlManager.getParams();

		// Clear other item params
		this.#storyUrlManager.clearItemParamsExcept(params, this.getUrlParam());

		// Build new URL
		const url = this.#storyUrlManager.buildStoryItemURL(
			params.get(StoryURLManager.PARAMS.CAMPAIGN),
			params.get(StoryURLManager.PARAMS.VIEW),
			itemId
		);

		// Create state
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.STORY, {
			campaignId: params.get(StoryURLManager.PARAMS.CAMPAIGN),
			viewType: params.get(StoryURLManager.PARAMS.VIEW),
			itemId: itemId,
			itemType: this.getUrlParam(),
		});

		this.#storyUrlManager.updateHistory(url, state, true);
	}

	findItemById(items, itemId) {
		return items.find((item) => this.getItemId(item) === itemId);
	}

	// Main render method
	render(contentArea) {
		const items = this.getItems();

		if (!items?.length) {
			contentArea.innerHTML = `
				<div class="story-view-container">
					<div class="view-header"><h2>${this.getViewTitle()}</h2></div>
					<div class="no-content">No ${this.getViewTitle().toLowerCase()} available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-view-container';

		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = `<h2>${this.getViewTitle()}</h2>`;

		const body = document.createElement('div');
		body.className = 'view-body';

		const listPanel = document.createElement('div');
		listPanel.className = 'view-list-panel';
		this.#listPanel = listPanel;

		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		const groupedItems = this.groupItems(items);
		this.renderGroups(listPanel, groupedItems, detailPanel);

		// Handle URL targeting
		const targetId = this.getTargetFromUrl();
		let initialItem = null;

		if (targetId) {
			initialItem = this.findItemById(items, decodeURIComponent(targetId));

			if (initialItem) {
				setTimeout(() => {
					const targetElement = listPanel.querySelector(`[data-item-id="${this.getItemId(initialItem)}"]`);
					targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}
		}

		this.selectItem(initialItem || items[0], detailPanel);

		body.append(listPanel, detailPanel);
		container.append(header, body);
		contentArea.appendChild(container);
	}

	// Render groups (can be overridden for nested structures)
	renderGroups(container, groupedItems, detailPanel) {
		Object.entries(groupedItems).forEach(([groupName, items]) => {
			this.renderGroup(container, groupName, items, detailPanel);
		});
	}

	renderGroup(container, groupName, items, detailPanel) {
		const group = document.createElement('div');
		group.className = 'view-group';

		const groupContent = document.createElement('div');
		groupContent.className = 'view-group-content';

		const groupHeader = StoryDOMBuilder.createToggleHeader(groupName, groupContent);
		group.appendChild(groupHeader);

		items.forEach((item) => {
			const listItem = this.createListItem(item, detailPanel);
			groupContent.appendChild(listItem);
		});

		group.appendChild(groupContent);
		container.appendChild(group);
	}

	createListItem(item, detailPanel) {
		const listItem = document.createElement('div');
		listItem.className = 'view-list-item';
		const itemId = this.getItemId(item);
		listItem.dataset.itemId = itemId;

		const content = this.createListItemContent(item);
		listItem.appendChild(content);

		listItem.addEventListener('click', () => {
			this.selectItem(item, detailPanel);
		});

		return listItem;
	}

	createListItemContent(item) {
		const name = document.createElement('span');
		name.className = 'view-item-name';
		name.textContent = item.name || item.title;
		return name;
	}

	selectItem(item, detailPanel) {
		const itemId = this.getItemId(item);
		this.#selectedItemId = itemId;

		this.updateUrl(itemId);

		if (this.#listPanel) {
			const allItems = this.#listPanel.querySelectorAll('.view-list-item');
			allItems.forEach((listItem) => {
				listItem.classList.toggle('selected', listItem.dataset.itemId === itemId);
			});
		}

		detailPanel.innerHTML = '';
		const detailContent = this.createDetailContent(item);
		detailPanel.appendChild(detailContent);
	}

	// Utility methods using StoryDOMBuilder
	createSection(title, content, contentClass = '') {
		const section = StoryDOMBuilder.createSection(title, content, contentClass);
		this.#placeholderProcessor.processEntityReferences(section.querySelector('.view-section-content'));
		return section;
	}

	createListSection(title, items) {
		const ul = StoryDOMBuilder.createList(items, 'view-list');
		this.#placeholderProcessor.processEntityReferences(ul);
		return this.createSection(title, ul);
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
				this.#placeholderProcessor.processEntityReferences(desc);
				card.appendChild(desc);
			}

			content.appendChild(card);
		});

		return this.createSection('Party Encounters', content);
	}

	createLinksSection(links) {
		const content = document.createElement('ul');
		content.className = 'view-links';

		links.forEach((link) => {
			const card = document.createElement('li');
			card.className = 'view-link';

			const linkContent = document.createElement('a');
			linkContent.className = 'view-link-anchor';
			linkContent.textContent = link.title;
			linkContent.href = link.link;
			linkContent.target = '_blank';

			card.append(linkContent);
			content.append(card);
		});

		return this.createSection('Involved in', content);
	}

	formatName(name) {
		return StoryDOMBuilder.formatName(name);
	}

	createMetaTags(metaData) {
		return StoryDOMBuilder.createMetaTags(metaData);
	}

	processEntityReference(entity) {
		const processedText = entity.replace(
			/\[ENTITY:([\w-]+):([^:\]]+)(?::([^\]]+))?\]/gi,
			(match, type, name, givenName) => {
				const cleanType = type.toLowerCase().trim();
				const cleanName = name.trim();

				if (!cleanType || !cleanName) return match;

				const displayText = givenName ? givenName.trim() : cleanName;
				return displayText;
			}
		);
		return processedText;
	}

	// Getters
	get campaign() {
		return this.#campaign;
	}

	get placeholderProcessor() {
		return this.#placeholderProcessor;
	}
}
