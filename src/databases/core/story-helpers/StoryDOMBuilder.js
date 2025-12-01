// --- START OF FILE StoryDOMBuilder.js ---

class StoryDOMBuilder {
	static createToggleHeader(title, contentElement, className = '') {
		const header = document.createElement('div');
		header.className = `view-group-header ${className}`;
		header.innerHTML = `
            <span class="title">${title}</span>
            <span class="icon">▼</span>
        `;
		header.onclick = () => {
			const isHidden = contentElement.style.display === 'none';
			contentElement.style.display = isHidden ? 'block' : 'none';
			header.querySelector('.icon').textContent = isHidden ? '▼' : '▶';
		};
		return header;
	}

	static createSection(title, content, className = '') {
		const div = document.createElement('div');
		div.className = `view-section ${className}`;

		const h3 = document.createElement('div');
		h3.className = 'view-section-header';
		h3.textContent = title;

		const body = document.createElement('div');
		body.className = 'view-section-content';

		if (typeof content === 'string') body.innerHTML = content;
		else body.appendChild(content);

		div.append(h3, body);
		return div;
	}

	static createList(items, className = 'view-list') {
		const ul = document.createElement('ul');
		ul.className = className;
		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = typeof item === 'object' ? item.name || item.title : item;
			ul.appendChild(li);
		});
		return ul;
	}

	static formatName(str) {
		if (!str) return '';
		return str.replace(/-|_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}

	static createMetaTags(tags) {
		const div = document.createElement('div');
		div.className = 'view-meta-tags';
		tags.forEach((tag) => {
			if (tag.text) {
				const span = document.createElement('span');
				span.className = `tag ${tag.className || ''}`;
				span.textContent = tag.text;
				div.appendChild(span);
			}
		});
		return div;
	}

	static createAbilityScores(scores) {
		const grid = document.createElement('div');
		grid.className = 'character-abilities__grid';
		scores.forEach((s) => {
			grid.innerHTML += `
                <div class="ability">
                    <span class="name">${s.abbr}</span>
                    <span class="score">${s.value}</span>
                    <span class="mod">(${s.modifier >= 0 ? '+' : ''}${s.modifier})</span>
                </div>
            `;
		});
		return grid;
	}
}
