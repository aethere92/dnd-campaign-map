class StoryHelperBase {
	#campaign;
	#placeholderProcessor;
	#selectedItemId = null;
	#listPanel = null;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	// Abstract methods (same as before)
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

	// NEW: Get URL parameter name for this view type
	getUrlParam() {
		throw new Error('getUrlParam() must be implemented by subclass');
	}

	// NEW: Parse URL and get target item ID
	getTargetFromUrl() {
		const params = new URLSearchParams(window.location.search);
		return params.get(this.getUrlParam());
	}

	// NEW: Update URL without page reload
	updateUrl(itemId) {
		const params = new URLSearchParams(window.location.search);

		// Clear all other item-specific parameters to avoid conflicts
		const itemParams = ['quest', 'location', 'npc', 'faction'];
		itemParams.forEach((param) => {
			if (param !== this.getUrlParam()) {
				params.delete(param);
			}
		});

		if (itemId) {
			params.set(this.getUrlParam(), encodeURIComponent(itemId));
		} else {
			params.delete(this.getUrlParam());
		}

		// Build URL with parameters in correct order: campaign, view, then item
		const orderedParams = new URLSearchParams();

		// Add campaign first
		if (params.has('campaign')) {
			orderedParams.set('campaign', params.get('campaign'));
		}

		// Add view second
		if (params.has('view')) {
			orderedParams.set('view', params.get('view'));
		}

		// Add item-specific parameter third
		if (itemId) {
			orderedParams.set(this.getUrlParam(), encodeURIComponent(itemId));
		}

		// Add any other parameters
		for (const [key, value] of params.entries()) {
			if (key !== 'campaign' && key !== 'view' && !itemParams.includes(key)) {
				orderedParams.set(key, value);
			}
		}

		const newUrl = `${window.location.pathname}?${orderedParams.toString()}${window.location.hash}`;

		// Include meaningful state for history
		const state = {
			campaignId: params.get('campaign'),
			view: params.get('view'),
			itemId: itemId || null,
			itemType: this.getUrlParam(),
		};

		window.history.replaceState(state, '', newUrl);
	}

	// NEW: Find item by ID
	findItemById(items, itemId) {
		return items.find((item) => this.getItemId(item) === itemId);
	}

	// Shared render method (modified to handle URL targeting)
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

		// NEW: Check URL for target item
		const targetId = this.getTargetFromUrl();
		let initialItem = null;

		if (targetId) {
			initialItem = this.findItemById(items, decodeURIComponent(targetId));

			// If item found, scroll it into view after a brief delay
			if (initialItem) {
				setTimeout(() => {
					const targetElement = listPanel.querySelector(`[data-item-id="${this.getItemId(initialItem)}"]`);
					if (targetElement) {
						targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
				}, 100);
			}
		}

		// Select either URL-targeted item or first item
		this.selectItem(initialItem || items[0], detailPanel);

		body.append(listPanel, detailPanel);
		container.append(header, body);
		contentArea.appendChild(container);
	}

	// Shared method for rendering groups (can be overridden)
	renderGroups(container, groupedItems, detailPanel) {
		Object.entries(groupedItems).forEach(([groupName, items]) => {
			this.renderGroup(container, groupName, items, detailPanel);
		});
	}

	// Render a single group
	renderGroup(container, groupName, items, detailPanel) {
		const group = document.createElement('div');
		group.className = 'view-group';

		// Create group content wrapper for toggle functionality
		const groupContent = document.createElement('div');
		groupContent.className = 'view-group-content';

		const groupHeader = this.createGroupHeader(groupName, groupContent);
		group.appendChild(groupHeader);

		// Add items to content wrapper
		items.forEach((item) => {
			const listItem = this.createListItem(item, detailPanel);
			groupContent.appendChild(listItem);
		});

		group.appendChild(groupContent);
		container.appendChild(group);
	}

	// Create a group header with toggle functionality
	createGroupHeader(groupName, contentElement) {
		const groupHeader = document.createElement('div');
		groupHeader.className = 'view-group-header';

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

	// Create list item (can be overridden for custom styling)
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

	// Override this to customize list item content
	createListItemContent(item) {
		const name = document.createElement('span');
		name.className = 'view-item-name';
		name.textContent = item.name || item.title;
		return name;
	}

	// Select an item (modified to update URL)
	selectItem(item, detailPanel) {
		const itemId = this.getItemId(item);
		this.#selectedItemId = itemId;

		// NEW: Update URL when item is selected
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

	// Utility: Create a section with header and content
	createSection(title, content, contentClass = '') {
		const section = document.createElement('div');
		section.className = 'view-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = title;

		const contentDiv = document.createElement('div');
		contentDiv.className = `view-section-content ${contentClass}`.trim();

		if (typeof content === 'string') {
			contentDiv.innerHTML = content;
		} else {
			contentDiv.appendChild(content);
		}

		this.#placeholderProcessor.processEntityReferences(contentDiv);
		section.append(header, contentDiv);
		return section;
	}

	// Utility: Create a list section
	createListSection(title, items) {
		const ul = document.createElement('ul');
		ul.className = 'view-list';

		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = typeof item === 'string' ? item : item.name || item.title;
			this.#placeholderProcessor.processEntityReferences(li);
			ul.appendChild(li);
		});

		return this.createSection(title, ul);
	}

	// Utility: Create an encounters section
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

	// Utility: Format type names (e.g., "some-type" -> "Some Type")
	formatName(name) {
		return name
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Utility: Create meta tags
	createMetaTags(metaData) {
		const meta = document.createElement('div');
		meta.className = 'view-detail-meta';

		metaData.forEach(({ className, text }) => {
			if (text) {
				const span = document.createElement('span');
				span.className = `view-meta-tag ${className}`;
				span.textContent = text;
				meta.appendChild(span);
			}
		});

		return meta;
	}

	// Getters for protected properties
	get campaign() {
		return this.#campaign;
	}

	get placeholderProcessor() {
		return this.#placeholderProcessor;
	}
}
