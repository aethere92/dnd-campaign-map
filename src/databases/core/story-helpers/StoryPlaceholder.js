class StoryHelperPlaceholder {
	#tooltipManager;
	#campaign;

	constructor(tooltipManager, campaign) {
		this.#tooltipManager = tooltipManager;
		this.#campaign = campaign;
	}

	processAll(contentElement, session = null) {
		this.#processImages(contentElement);
		this.#processCharacterReferences(contentElement);
		this.processEntityReferences(contentElement);

		if (session) {
			this.#processProgressionTags(contentElement, session);
		}

		this.#processCharacterHighlights(contentElement);
	}

	processTimelinePlaceholders(timelineContainer) {
		const timelineItems = timelineContainer.querySelectorAll('.timeline-item');

		timelineItems.forEach((item) => {
			const contentElements = item.querySelectorAll(
				'.timeline-content, .timeline-sub-description, .timeline-main-description'
			);

			contentElements.forEach((element) => {
				this.#processImages(element);
				this.#processCharacterReferences(element);
				this.processEntityReferences(element);

				if (item.classList.contains('timeline-main-item')) {
					const itemId = item.getAttribute('data-id');
					const timelineData = this.#campaign?.timeline;

					if (timelineData?.length) {
						const itemData = timelineData.find((data) => data.id === itemId);
						if (itemData) {
							this.#processProgressionTags(element, itemData);
						}
					}
				}

				this.#processCharacterHighlights(element);
			});
		});
	}

	processEntityReferences(contentElement) {
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[ENTITY:([\w-]+):([^:\]]+)(?::([^\]]+))?\]/gi,
			(match, type, name, givenName) => {
				const cleanType = type.toLowerCase().trim();
				const cleanName = name.trim();

				if (!cleanType || !cleanName) return match;

				const displayText = givenName ? givenName.trim() : cleanName;
				return `<span class="entity-reference entity-${cleanType}" data-entity-type="${cleanType}" data-entity-name="${cleanName}">${displayText}</span>`;
			}
		);

		contentElement.innerHTML = processedText;

		// IMPORTANT: Re-query the spans AFTER setting innerHTML
		const entitySpans = contentElement.querySelectorAll('.entity-reference');
		entitySpans.forEach((span) => {
			const entityType = span.getAttribute('data-entity-type');
			const entityName = span.getAttribute('data-entity-name');

			if (entityType && entityName) {
				this.#tooltipManager.addTooltip(span, entityType, entityName);
			}
		});
	}

	#processImages(contentElement) {
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[IMAGE:(.*?)(?::(.*?))?(?::(.*?))?(?::(.*?))?(?::(.*?))?\]/g,
			(match, src, caption = '', width = '', alignment = 'center', inline = 'false') => {
				const widthAttr = width ? `width="${width}"` : '';
				const alignClass = `image-align-${alignment}`;
				const inlineClass = inline === 'true' ? 'image-inline' : '';

				return `
					<div class="story-image-container ${alignClass} ${inlineClass}">
						<img src="${src}" ${widthAttr} alt="${caption}" />
						${caption ? `<div class="image-caption">${caption}</div>` : ''}
					</div>
				`;
			}
		);

		contentElement.innerHTML = processedText;
	}

	#processCharacterReferences(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		const characterNames = this.#campaign.metadata.characters
			.map((char) => char.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
			.join('|');

		if (!characterNames) return;

		const characterRegex = new RegExp(`\\[CHARACTER:(${characterNames})\\]`, 'g');
		const textNodes = this.#getTextNodes(contentElement);

		textNodes.forEach((textNode) => {
			const text = textNode.nodeValue;
			if (!characterRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			characterRegex.lastIndex = 0;

			let match;
			while ((match = characterRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}

				const span = document.createElement('span');
				span.className = 'character-highlight';
				span.setAttribute('data-character', match[1]);
				span.textContent = match[1];
				fragment.appendChild(span);

				lastIndex = characterRegex.lastIndex;
			}

			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}

			textNode.parentNode.replaceChild(fragment, textNode);
		});
	}

	#processCharacterHighlights(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		const characterMap = new Map();
		this.#campaign.metadata.characters.forEach((char) => {
			characterMap.set(char.name, char);
		});

		const spans = contentElement.querySelectorAll('span.character-highlight');
		spans.forEach((span) => {
			const characterName = span.getAttribute('data-character');
			const character = characterMap.get(characterName);

			if (character) {
				span.textContent = characterName;
				this.#tooltipManager.addTooltip(span, 'character', characterName);
			}
		});
	}

	#processProgressionTags(contentElement, session) {
		const progressionRegex = /\[PROGRESSION:(levelup|loot):(.*?)\]/g;
		const textNodes = this.#getTextNodes(contentElement);

		textNodes.forEach((node) => {
			const text = node.nodeValue;
			if (!progressionRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			progressionRegex.lastIndex = 0;

			let match;
			while ((match = progressionRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}

				const type = match[1];
				const value = match[2];
				let replacementNode = null;

				if (type === 'levelup') {
					replacementNode = this.#createLevelUpElement(value);
				} else if (type === 'loot') {
					replacementNode = this.#createLootElement(value, session);
				}

				if (replacementNode) {
					fragment.appendChild(replacementNode);
				}

				lastIndex = progressionRegex.lastIndex;
			}

			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}

			node.parentNode.replaceChild(fragment, node);
		});
	}

	#createLevelUpElement(level) {
		const div = document.createElement('div');
		div.className = 'progression-levelup';
		div.innerHTML = `
			<div class="levelup-icon">
				<img src="images/assets/d20.png"/>
			</div>
			<div class="levelup-text">
				<span>Level Up!</span>
				<p>Congratulations! The party has reached level <strong>${level}</strong>!</p>
			</div>
		`;
		return div;
	}

	#createLootElement(lootId, session) {
		const container = document.createElement('div');
		container.className = 'progression-loot';

		const lootData = session?.progression?.loot?.find((l) => l.id === lootId);
		if (!lootData?.data?.length) {
			container.innerHTML = '<p><em>Loot information not found.</em></p>';
			return container;
		}

		const title = document.createElement('span');
		title.textContent = 'Loot found';
		title.className = 'progression-loot-title';
		container.appendChild(title);

		const list = document.createElement('ul');
		list.className = 'loot-list';

		lootData.data.forEach((item) => {
			const listItem = this.#createLootItem(item);
			list.appendChild(listItem);
		});

		container.appendChild(list);
		return container;
	}

	#createLootItem(item) {
		const listItem = document.createElement('li');
		listItem.className = `loot-item rarity-${item.rarity || 'common'}`;

		const ownerText = item.owner ? ` <span class="loot-owner">[ENTITY:character:${item.owner}]</span>` : '';

		const itemNameSpan = document.createElement('span');
		itemNameSpan.className = 'loot-item-name';
		itemNameSpan.innerHTML = `${item.itemName}${item.count > 1 ? ` (x${item.count})` : ''}`;

		listItem.innerHTML = `
			<div class="loot-item-metadata">
				${itemNameSpan.outerHTML}
				${item.description ? `<span class="loot-item-description">${item.description}</span>` : ''}
			</div>
			${ownerText}
		`;

		this.processEntityReferences(listItem);

		if (item.description) {
			const descDiv = listItem.querySelector('.loot-item-description');
			if (descDiv) this.processEntityReferences(descDiv);
		}

		return listItem;
	}

	#getTextNodes(element) {
		const textNodes = [];
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node);
		}

		return textNodes;
	}
}
