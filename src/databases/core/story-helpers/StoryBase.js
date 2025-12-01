// --- START OF FILE StoryBase.js ---

class StoryHelperBase {
	#campaign;
	#placeholderProcessor;
	#selectedItemId = null;
	#listPanel = null;
	#storyUrlManager;
	#supabaseClient;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
		this.#storyUrlManager = new StoryURLManager();
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	// Abstract methods
	async getItems() {
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
		return item.id;
	} // Default to UUID
	getUrlParam() {
		throw new Error('getUrlParam() must be implemented by subclass');
	}

	// URL management
	getTargetFromUrl() {
		return this.#storyUrlManager.getParam(this.getUrlParam());
	}

	updateUrl(itemId) {
		const params = this.#storyUrlManager.getParams();
		this.#storyUrlManager.clearItemParamsExcept(params, this.getUrlParam());

		const url = this.#storyUrlManager.buildStoryItemURL(
			params.get(StoryURLManager.PARAMS.CAMPAIGN),
			params.get(StoryURLManager.PARAMS.VIEW),
			itemId
		);

		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.STORY, {
			campaignId: params.get(StoryURLManager.PARAMS.CAMPAIGN),
			viewType: params.get(StoryURLManager.PARAMS.VIEW),
			itemId: itemId,
			itemType: this.getUrlParam(),
		});

		this.#storyUrlManager.updateHistory(url, state, true);
	}

	findItemById(items, itemId) {
		if (!itemId) return null;
		return items.find((item) => String(this.getItemId(item)) === String(itemId));
	}

	// Main render method
	async render(contentArea) {
		contentArea.innerHTML = `
            <div class="story-view-container">
                <div class="view-header"><h2>${this.getViewTitle()}</h2></div>
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading ${this.getViewTitle().toLowerCase()}...</p>
                </div>
            </div>
        `;

		try {
			const items = await this.getItems();

			if (!items?.length) {
				contentArea.innerHTML = `
                    <div class="story-view-container">
                        <div class="view-header"><h2>${this.getViewTitle()}</h2></div>
                        <div class="no-content">No ${this.getViewTitle().toLowerCase()} available.</div>
                    </div>
                `;
				return;
			}

			const container = document.createElement('div');
			container.className = 'story-view-container';

			const body = document.createElement('div');
			body.className = 'view-body';

			const listPanel = document.createElement('div');
			listPanel.className = 'view-list-panel';
			this.#listPanel = listPanel;

			const detailPanel = document.createElement('div');
			detailPanel.className = 'view-detail-panel';

			const targetId = this.getTargetFromUrl();
			let initialItem = items[0];

			if (targetId) {
				const foundItem = this.findItemById(items, targetId);
				if (foundItem) initialItem = foundItem;
			}

			const groupedItems = this.groupItems(items);
			this.renderGroups(listPanel, groupedItems, detailPanel);

			// Initial Select
			if (initialItem) {
				this.selectItem(initialItem, detailPanel);
			}

			if (targetId && initialItem) {
				setTimeout(() => {
					const el = listPanel.querySelector(`[data-item-id="${this.getItemId(initialItem)}"]`);
					el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}

			body.append(listPanel, detailPanel);
			container.appendChild(body);
			contentArea.innerHTML = '';
			contentArea.appendChild(container);
		} catch (error) {
			console.error('Error rendering view:', error);
			contentArea.innerHTML = `
                <div class="story-view-container">
                    <div class="view-header"><h2>${this.getViewTitle()}</h2></div>
                    <div class="error-message">Error loading content: ${error.message}</div>
                </div>
            `;
		}
	}

	renderGroups(container, groupedItems, detailPanel) {
		const sortedKeys = Object.keys(groupedItems).sort();
		sortedKeys.forEach((groupName) => {
			this.renderGroup(container, groupName, groupedItems[groupName], detailPanel);
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
		listItem.id = `list-item-${itemId}`; // For anchors

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
			this.#listPanel.querySelectorAll('.view-list-item').forEach((el) => {
				el.classList.toggle('selected', el.dataset.itemId === String(itemId));
			});
		}

		detailPanel.innerHTML = '';
		const detailContent = this.createDetailContent(item);
		detailPanel.appendChild(detailContent);
	}

	// Shared UI Builders
	createSection(title, content, contentClass = '') {
		const section = StoryDOMBuilder.createSection(title, content, contentClass);
		if (section.querySelector('.view-section-content')) {
			this.#placeholderProcessor.processEntityReferences(section.querySelector('.view-section-content'));
		}
		return section;
	}

	createListSection(title, items) {
		if (!items || items.length === 0) return document.createDocumentFragment();
		const ul = StoryDOMBuilder.createList(items, 'view-list');
		this.#placeholderProcessor.processEntityReferences(ul);
		return this.createSection(title, ul);
	}

	createEncountersSection(encounters) {
		if (!encounters || encounters.length === 0) return document.createDocumentFragment();
		const content = document.createElement('div');
		content.className = 'view-encounters';

		encounters.forEach((encounter) => {
			const card = document.createElement('div');
			card.className = 'view-card';

			const header = document.createElement('div');
			header.className = 'view-card-header';
			header.textContent = encounter.name || `Encounter`;
			card.appendChild(header);

			if (encounter.description) {
				const desc = document.createElement('p');
				desc.className = 'view-card-text';
				desc.textContent = encounter.description;
				this.#placeholderProcessor.processEntityReferences(desc);
				card.appendChild(desc);
			}
			content.appendChild(card);
		});

		return this.createSection('Encounters', content);
	}

	formatName(name) {
		return StoryDOMBuilder.formatName(name);
	}
	createMetaTags(metaData) {
		return StoryDOMBuilder.createMetaTags(metaData);
	}

	// Accessors
	get campaign() {
		return this.#campaign;
	}
	get placeholderProcessor() {
		return this.#placeholderProcessor;
	}
	get supabaseClient() {
		return this.#supabaseClient;
	}
}
