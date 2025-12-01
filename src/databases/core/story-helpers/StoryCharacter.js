// --- START OF FILE StoryCharacter.js ---

class StoryHelperCharacter {
	#campaign;
	#placeholderProcessor;
	#supabaseClient;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	async render(contentArea, characterId) {
		if (!characterId) {
			contentArea.innerHTML = '<div class="no-content">No character selected.</div>';
			return;
		}

		contentArea.innerHTML = '<div class="loader">Loading character sheet...</div>';

		try {
			const character = await this.#supabaseClient.getCharacterDetails(characterId);

			if (!character) {
				contentArea.innerHTML = '<div class="no-content">Character not found.</div>';
				return;
			}

			contentArea.innerHTML = '';
			const sheet = document.createElement('div');
			sheet.className = 'character-sheet';

			const header = this.#createHeader(character);
			const columns = this.#createColumns(character);

			sheet.append(header, columns);
			contentArea.appendChild(sheet);

			// Process placeholders
			this.#placeholderProcessor.processAll(sheet);
		} catch (e) {
			console.error(e);
			contentArea.innerHTML = '<div class="error">Error loading character.</div>';
		}
	}

	#createHeader(char) {
		const header = document.createElement('header');
		header.className = 'character-header';

		const title = document.createElement('h1');
		title.className = 'character-title';
		title.textContent = char.name;

		const subtitle = document.createElement('h2');
		subtitle.className = 'character-subtitle';
		subtitle.textContent = `${char.race || 'Unknown'} ${char.class || ''} • Level ${char.level || 1}`;

		header.append(title, subtitle);
		return header;
	}

	#createColumns(char) {
		const container = document.createElement('div');
		container.className = 'character-columns';

		container.append(this.#createLeftColumn(char), this.#createRightColumn(char));
		return container;
	}

	#createLeftColumn(char) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--left';

		if (char.image_bg || char.icon) {
			const div = document.createElement('div');
			div.className = 'character-portrait';
			div.innerHTML = `<img src="${char.image_bg || char.icon}" alt="${char.name}" />`;
			column.appendChild(div);
		}

		if (char.background) {
			column.appendChild(StoryDOMBuilder.createSection('Background', char.background, 'character-background'));
		}

		// Stats are likely in a JSONB column named 'stats'
		const stats = char.stats || {};

		if (stats.spells && stats.spells.length > 0) {
			column.appendChild(this.#createSpellsSection(stats.spells));
		}

		return column;
	}

	#createRightColumn(char) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--right';

		const stats = char.stats || {};
		const metadata = stats.metadata || stats; // Handle nesting variance

		// Vitals
		const vitals = [
			{ name: 'AC', value: metadata.armor_class || metadata.ac || 10, class: 'ac' },
			{ name: 'HP', value: metadata.hp || metadata.health_points || 10, class: 'hp' },
			{ name: 'Speed', value: metadata.speed || 30, class: 'speed' },
		];
		column.appendChild(this.#createVitalsGrid(vitals));

		// Abilities
		if (metadata.ability_scores) {
			column.appendChild(StoryDOMBuilder.createAbilityScores(metadata.ability_scores));
		}

		// Features
		if (metadata.features) {
			column.appendChild(this.#createFeaturesList(metadata.features));
		}

		return column;
	}

	#createVitalsGrid(items) {
		const section = document.createElement('section');
		section.className = 'character-section';
		const grid = document.createElement('div');
		grid.className = 'character-vitals__grid';

		items.forEach((v) => {
			grid.innerHTML += `
                <div class="character-vitals__item ${v.class}">
                    <span class="label">${v.name}</span>
                    <span class="value">${v.value}</span>
                </div>
            `;
		});
		section.appendChild(grid);
		return section;
	}

	#createFeaturesList(features) {
		const section = document.createElement('section');
		section.className = 'character-section';
		section.innerHTML = '<h3>Features & Traits</h3>';

		const list = document.createElement('ul');
		list.className = 'character-features-list';

		features.forEach((f) => {
			const li = document.createElement('li');
			li.innerHTML = `<strong>${f.name}:</strong> ${f.description}`;
			list.appendChild(li);
		});

		section.appendChild(list);
		return section;
	}

	#createSpellsSection(spells) {
		const section = document.createElement('section');
		section.className = 'character-section';
		section.innerHTML = '<h3>Spells</h3>';

		// Simple list for now, can be expanded
		const list = document.createElement('ul');
		spells.forEach((s) => {
			const li = document.createElement('li');
			li.textContent = typeof s === 'string' ? s : `${s.name} (${s.level || 'Cantrip'})`;
			list.appendChild(li);
		});
		section.appendChild(list);
		return section;
	}
}
