class StoryHelperTimeline {
	#campaign;
	#placeholderProcessor;

	// Type icon mapping
	#typeIcons = {
		narrative: '💬',
		encounter: '⚔️',
		investigation: '🔎',
		traversal: '👣',
	};

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea) {
		const timelineData = this.#campaign?.timeline;

		if (!timelineData?.length) {
			contentArea.innerHTML = `
				<div class="story-timeline-container visible">
					<div class="timeline-header"><h2>Campaign Timeline</h2></div>
					<div class="no-content">Timeline data not available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-timeline-container visible';

		const header = this.#createHeader();
		const timeline = this.#createTimeline(timelineData);

		container.append(header, timeline);
		contentArea.appendChild(container);

		this.#placeholderProcessor.processTimelinePlaceholders(container);
	}

	#createHeader() {
		const header = document.createElement('div');
		header.className = 'timeline-header';
		header.innerHTML = '<h2>Campaign Timeline</h2>';

		const toggleButton = document.createElement('button');
		toggleButton.className = 'timeline-toggle-all-button';
		toggleButton.textContent = 'Toggle descriptions';
		toggleButton.type = 'button';

		toggleButton.addEventListener('click', (e) => {
			const container = e.target.closest('.story-timeline-container');
			const descriptions = container.querySelectorAll('.timeline-main-description, .timeline-sub-description');
			const anyActive = Array.from(descriptions).some((desc) => desc.classList.contains('active'));

			descriptions.forEach((desc) => desc.classList.remove('active'));

			if (!anyActive) {
				setTimeout(() => {
					descriptions.forEach((desc) => desc.classList.add('active'));
				}, 50);
			}
		});

		header.appendChild(toggleButton);
		return header;
	}

	#createTimeline(timelineData) {
		const timeline = document.createElement('div');
		timeline.className = 'timeline';

		let side = 'left';

		timelineData.forEach((item) => {
			const mainItem = this.#createMainItem(item, side);
			timeline.appendChild(mainItem);

			if (item.items?.length) {
				item.items.forEach((subitem) => {
					const subitemEl = this.#createSubItem(subitem, item.id, side);
					timeline.appendChild(subitemEl);
				});
			}

			side = side === 'left' ? 'right' : 'left';
		});

		return timeline;
	}

	#createMainItem(item, side) {
		const mainItem = document.createElement('div');
		mainItem.className = `timeline-item timeline-main-item ${side}`;
		mainItem.setAttribute('data-id', item.id);

		const mainContent = document.createElement('div');
		mainContent.className = 'timeline-content';
		mainContent.innerHTML = `
			<h3>${item.title}</h3>
			<div class="timeline-location" style="margin-left: auto">${item.location}</div>
			${item.is_new_session ? '<div class="timeline-new-session">New session</div>' : ''}
			${item.session ? `<span class="timeline-item-session">Session ${item.session}</span>` : ''}
		`;

		if (item.url) {
			const link = this.#createSessionLink(item.url, mainContent);
			mainItem.appendChild(link);
		} else {
			mainItem.appendChild(mainContent);
		}

		if (item.description) {
			const { button, description } = this.#createToggleableDescription(
				item.description,
				'timeline-main-button',
				'timeline-main-description'
			);
			mainItem.append(button, description);
		}

		return mainItem;
	}

	#createSubItem(subitem, parentId, side) {
		const subitemEl = document.createElement('div');
		subitemEl.className = `timeline-item timeline-subitem ${side}`;
		subitemEl.setAttribute('data-parent-id', parentId);
		subitemEl.setAttribute('data-type', subitem.type);

		const subContent = document.createElement('div');
		subContent.className = 'timeline-content';

		let html = `
			<h4>
				<span style="font-size: 8pt">${this.#typeIcons[subitem.type] || '❓'}</span>
				${this.#capitalize(subitem.type)}: ${subitem.actors}
			</h4>
		`;

		if (subitem.is_new_session) {
			subitemEl.classList.add('new-session-indicator');
			html += '<div class="timeline-new-session">New session</div>';
		}

		if (subitem.sublocation) {
			html += `<div class="timeline-sublocation">${subitem.sublocation}</div>`;
		}

		subContent.innerHTML = html;

		if (subitem.url) {
			const link = this.#createSessionLink(subitem.url, subContent);
			subitemEl.appendChild(link);
		} else {
			subitemEl.appendChild(subContent);
		}

		if (subitem.description) {
			const { button, description } = this.#createToggleableDescription(
				subitem.description,
				'timeline-sub-button',
				'timeline-sub-description'
			);
			subitemEl.append(button, description);
		}

		return subitemEl;
	}

	#createSessionLink(urlData, content) {
		const link = document.createElement('a');
		link.href = `?campaign=${urlData.campaign}&session=${urlData.session}${urlData.target ? `#${urlData.target}` : ''}`;
		link.title = 'Go to this session recap point.';
		link.appendChild(content);
		return link;
	}

	#createToggleableDescription(descriptionHtml, buttonClass, descriptionClass) {
		const button = document.createElement('button');
		button.className = buttonClass;
		button.textContent = '›';
		button.type = 'button';

		const description = document.createElement('div');
		description.className = descriptionClass;
		description.innerHTML = descriptionHtml;

		button.onclick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			description.classList.toggle('active');
		};

		return { button, description };
	}

	#capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
