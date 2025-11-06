// Reusable DOM component builder
class StoryDOMBuilder {
	// Create a toggleable section header
	static createToggleHeader(title, contentElement, className = '', isExpanded = true) {
		const header = document.createElement('div');
		header.className = `view-group-header ${className}`.trim();

		const titleElement = document.createElement('span');
		titleElement.className = 'view-group-header-title';
		titleElement.textContent = title;

		const toggleButton = document.createElement('button');
		toggleButton.className = 'view-group-toggle';
		toggleButton.setAttribute('aria-expanded', isExpanded);
		toggleButton.setAttribute('aria-label', `Toggle ${title} group`);
		toggleButton.innerHTML = `<span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>`;

		const toggle = () => {
			const currentlyExpanded = contentElement.style.display !== 'none';
			contentElement.style.display = currentlyExpanded ? 'none' : 'block';
			toggleButton.setAttribute('aria-expanded', !currentlyExpanded);
			toggleButton.querySelector('.toggle-icon').textContent = currentlyExpanded ? '▶' : '▼';
		};

		toggleButton.addEventListener('click', (e) => {
			e.stopPropagation();
			toggle();
		});

		titleElement.addEventListener('click', (e) => {
			e.stopPropagation();
			toggle();
		});

		header.append(titleElement, toggleButton);
		return header;
	}

	// Create a toggleable content section
	static createToggleableContent(content, toggleClass, descriptionClass, buttonText = 'Show') {
		const toggle = document.createElement('button');
		toggle.className = toggleClass;
		toggle.textContent = buttonText;

		const description = document.createElement('div');
		description.className = descriptionClass;
		description.innerHTML = content;
		description.style.display = 'none';

		toggle.addEventListener('click', () => {
			const isVisible = description.style.display !== 'none';
			description.style.display = isVisible ? 'none' : 'block';
			toggle.textContent = isVisible ? buttonText : 'Hide';
		});

		return { toggle, description };
	}

	// Create a "Toggle All" button for sections
	static createToggleAllButton(sectionSelector, descriptionSelector, toggleSelector) {
		const button = document.createElement('button');
		button.className = 'character-section__toggle-all';
		button.textContent = 'Toggle All';
		
		button.addEventListener('click', (e) => {
			const section = e.target.closest(sectionSelector);
			const descriptions = section.querySelectorAll(descriptionSelector);
			const anyVisible = Array.from(descriptions).some(d => d.style.display !== 'none');

			descriptions.forEach(desc => desc.style.display = anyVisible ? 'none' : 'block');
			section.querySelectorAll(toggleSelector).forEach(btn => {
				btn.textContent = anyVisible ? 'Show' : 'Hide';
			});
		});

		return button;
	}

	// Create meta tags
	static createMetaTags(metaData) {
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

	// Create a list section
	static createList(items, className = 'view-list') {
		const ul = document.createElement('ul');
		ul.className = className;

		items.forEach(item => {
			const li = document.createElement('li');
			li.textContent = typeof item === 'string' ? item : item.name || item.title;
			ul.appendChild(li);
		});

		return ul;
	}

	// Create a section with header and content
	static createSection(title, content, contentClass = '') {
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

		section.append(header, contentDiv);
		return section;
	}

	// Format type names (e.g., "some-type" -> "Some Type")
	static formatName(name) {
		return name
			.split(/[-_]/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Create ability scores display
	static createAbilityScores(scores) {
		if (!scores || !Array.isArray(scores)) return null;

		const grid = document.createElement('div');
		grid.className = 'character-abilities__grid';

		scores.forEach(ability => {
			const item = document.createElement('div');
			item.className = 'character-abilities__item';
			item.innerHTML = `
				<div class="character-abilities__name">${ability.abbr.toUpperCase()}</div>
				<div class="character-abilities__value">${ability.value}</div>
				<div class="character-abilities__modifier">(${ability.score})</div>
			`;
			grid.appendChild(item);
		});

		return grid;
	}

	// Create header with toggleable row
	static createToggleableHeaderRow(title, items, descriptionSelector, toggleSelector) {
		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = title;
		headerRow.appendChild(header);

		if (items.some(item => item.description)) {
			const toggleAll = this.createToggleAllButton(
				'.character-section',
				descriptionSelector,
				toggleSelector
			);
			headerRow.appendChild(toggleAll);
		}

		return headerRow;
	}
}