class StoryHelperCharacter {
	#campaign;
	#placeholderProcessor;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea, characterName) {
		if (!characterName) {
			contentArea.innerHTML = '<div class="no-content">No character selected.</div>';
			return;
		}

		if (!this.#campaign.metadata?.characters) {
			contentArea.innerHTML = '<div class="no-content">Character information not available for this campaign.</div>';
			return;
		}

		const character = this.#campaign.metadata.characters.find((c) => c.name === characterName);
		if (!character) {
			console.error(`Character not found: ${characterName}`);
			contentArea.innerHTML = '<div class="no-content">Character details not found.</div>';
			return;
		}

		const sheet = document.createElement('div');
		sheet.className = 'character-sheet';

		const header = this.#createHeader(character);
		const columns = this.#createColumns(character);

		sheet.append(header, columns);
		contentArea.appendChild(sheet);
	}

	#createHeader(character) {
		const header = document.createElement('header');
		header.className = 'character-header';

		const title = document.createElement('h1');
		title.className = 'character-title';
		title.textContent = character.name;

		const subtitle = document.createElement('h2');
		subtitle.className = 'character-subtitle';
		subtitle.textContent = `${character.race} ${character.class} • Level ${character.level}`;

		header.append(title, subtitle);
		return header;
	}

	#createColumns(character) {
		const container = document.createElement('div');
		container.className = 'character-columns';

		const leftColumn = this.#createLeftColumn(character);
		const rightColumn = this.#createRightColumn(character);

		container.append(leftColumn, rightColumn);
		return container;
	}

	#createLeftColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--left';

		if (character.imageBg) {
			const portrait = this.#createPortrait(character);
			column.appendChild(portrait);
		}

		if (character.background) {
			const section = this.#createBackgroundSection(character.background);
			column.appendChild(section);
		}

		if (character.stats?.metadata?.spellData?.length) {
			const spells = this.#createSpellsSection(character.stats.metadata.spellData);
			column.appendChild(spells);
		}

		return column;
	}

	#createPortrait(character) {
		const portrait = document.createElement('div');
		portrait.className = 'character-portrait';

		const img = document.createElement('img');
		img.src = character.imageBg;
		img.alt = `${character.name} portrait`;
		img.className = 'character-portrait__image';

		portrait.appendChild(img);
		return portrait;
	}

	#createBackgroundSection(background) {
		const section = document.createElement('section');
		section.className = 'character-section character-background';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Background';

		const content = document.createElement('div');
		content.className = 'character-section__content';
		content.innerHTML = background;
		this.#placeholderProcessor.processEntityReferences(content);

		section.append(header, content);
		return section;
	}

	#createRightColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--right';

		const metadata = character.stats?.metadata;
		if (!metadata) return column;

		if (metadata.armorClass || metadata.healthPoints || metadata.walkingSpeed) {
			column.appendChild(this.#createVitalsSection(metadata));
		}

		if (metadata.abilityScores?.length) {
			column.appendChild(this.#createAbilitiesSection(metadata.abilityScores));
		}

		if (metadata.savingThrows?.length) {
			column.appendChild(this.#createSavingThrowsSection(metadata.savingThrows));
		}

		if (metadata.actionData?.length) {
			column.appendChild(this.#createActionsSection(metadata.actionData));
		}

		if (metadata.features?.length) {
			column.appendChild(this.#createFeaturesSection(metadata.features));
		}

		return column;
	}

	#createVitalsSection(metadata) {
		const section = document.createElement('section');
		section.className = 'character-section character-vitals';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Vital Statistics';

		const grid = document.createElement('div');
		grid.className = 'character-vitals__grid';

		const vitals = [
			{ name: 'Armor Class', value: metadata.armorClass || '-', class: 'ac' },
			{ name: 'Hit Points', value: metadata.healthPoints || '-', class: 'hp' },
			{ name: 'Speed', value: metadata.walkingSpeed || '-', class: 'speed' },
		];

		vitals.forEach((vital) => {
			const item = document.createElement('div');
			item.className = `character-vitals__item character-vitals__item--${vital.class}`;
			item.innerHTML = `
				<span class="character-vitals__label">${vital.name}</span>
				<span class="character-vitals__value">${vital.value}</span>
			`;
			grid.appendChild(item);
		});

		section.append(header, grid);
		return section;
	}

	#createAbilitiesSection(abilityScores) {
		const section = document.createElement('section');
		section.className = 'character-section character-abilities';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Ability Scores';

		const grid = document.createElement('div');
		grid.className = 'character-abilities__grid';

		abilityScores.forEach((ability) => {
			const item = document.createElement('div');
			item.className = 'character-abilities__item';
			item.innerHTML = `
				<div class="character-abilities__name">${ability.abbr.toUpperCase()}</div>
				<div class="character-abilities__value">${ability.value}</div>
				<div class="character-abilities__modifier">(${ability.score})</div>
			`;
			grid.appendChild(item);
		});

		section.append(header, grid);
		return section;
	}

	#createSavingThrowsSection(savingThrows) {
		const section = document.createElement('section');
		section.className = 'character-section character-saves';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Saving Throws';

		const list = document.createElement('div');
		list.className = 'character-saves__list';

		savingThrows.forEach((save) => {
			const item = document.createElement('div');
			item.className = 'character-saves__item';
			item.innerHTML = `
				<span class="character-saves__name">${save.name.toUpperCase()}</span>
				<span class="character-saves__value">${save.value}</span>
			`;
			list.appendChild(item);
		});

		section.append(header, list);
		return section;
	}

	#createActionsSection(actions) {
		const section = document.createElement('section');
		section.className = 'character-section character-actions';

		const headerRow = this.#createToggleableHeaderRow(
			'Actions',
			actions,
			'.character-actions__description',
			'.character-actions__toggle'
		);
		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-actions__list';

		actions.forEach((action) => {
			const item = this.#createActionItem(action);
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createActionItem(action) {
		const item = document.createElement('div');
		item.className = 'character-actions__item';

		const nameRow = document.createElement('div');
		nameRow.className = 'character-actions__name-row';

		const name = document.createElement('h4');
		name.className = 'character-actions__name';
		name.textContent = action.name;
		nameRow.appendChild(name);

		if (action.description) {
			const { toggle, description } = this.#createToggleableContent(
				action.description,
				'character-actions__toggle',
				'character-actions__description'
			);
			nameRow.appendChild(toggle);
			item.append(nameRow, description);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createFeaturesSection(features) {
		const section = document.createElement('section');
		section.className = 'character-section character-features';

		const headerRow = this.#createToggleableHeaderRow(
			'Features & Traits',
			features,
			'.character-features__description',
			'.character-features__toggle'
		);
		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-features__list';

		features.forEach((feature) => {
			const item = this.#createFeatureItem(feature);
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createFeatureItem(feature) {
		const item = document.createElement('div');
		item.className = 'character-features__item';

		const nameRow = document.createElement('div');
		nameRow.className = 'character-features__name-row';

		const name = document.createElement('h4');
		name.className = 'character-features__name';
		name.textContent = feature.name;
		nameRow.appendChild(name);

		if (feature.description) {
			const { toggle, description } = this.#createToggleableContent(
				feature.description,
				'character-features__toggle',
				'character-features__description'
			);
			nameRow.appendChild(toggle);
			item.append(nameRow, description);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createToggleableHeaderRow(title, items, descriptionSelector, toggleSelector) {
		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = title;
		headerRow.appendChild(header);

		if (items.some((item) => item.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', (e) => {
				const section = e.target.closest('.character-section');
				const descriptions = section.querySelectorAll(descriptionSelector);
				const anyVisible = Array.from(descriptions).some((d) => d.style.display !== 'none');

				descriptions.forEach((desc) => (desc.style.display = anyVisible ? 'none' : 'block'));
				section.querySelectorAll(toggleSelector).forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		return headerRow;
	}

	#createToggleableContent(content, toggleClass, descriptionClass) {
		const toggle = document.createElement('button');
		toggle.className = toggleClass;
		toggle.textContent = 'Show';

		const description = document.createElement('div');
		description.className = descriptionClass;
		description.innerHTML = content;
		description.style.display = 'none';
		this.#placeholderProcessor.processEntityReferences(description);

		toggle.addEventListener('click', () => {
			const isVisible = description.style.display !== 'none';
			description.style.display = isVisible ? 'none' : 'block';
			toggle.textContent = isVisible ? 'Show' : 'Hide';
		});

		return { toggle, description };
	}

	#createSpellsSection(spellData) {
		const section = document.createElement('section');
		section.className = 'character-section character-spells';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Spells';

		section.appendChild(header);

		spellData.forEach((group) => {
			const groupContainer = this.#createSpellGroup(group);
			section.appendChild(groupContainer);
		});

		return section;
	}

	#createSpellGroup(group) {
		const container = document.createElement('div');
		container.className = 'character-spells__group';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-spells__group-header-row';

		const header = document.createElement('h4');
		header.className = 'character-spells__group-header';
		header.textContent = group.groupName;
		headerRow.appendChild(header);

		const list = document.createElement('div');
		list.className = 'character-spells__list';

		if (group.spells.length > 0) {
			const toggle = document.createElement('button');
			toggle.className = 'character-spells__group-toggle';
			toggle.textContent = 'Hide spells';
			toggle.addEventListener('click', () => {
				const isVisible = list.style.display !== 'none';
				list.style.display = isVisible ? 'none' : 'flex';
				toggle.textContent = isVisible ? 'Show spells' : 'Hide spells';
			});
			headerRow.appendChild(toggle);
		}

		container.appendChild(headerRow);

		group.spells.forEach((spell) => {
			const item = this.#createSpellItem(spell);
			list.appendChild(item);
		});

		container.appendChild(list);
		return container;
	}

	#createSpellItem(spell) {
		const item = document.createElement('div');
		item.className = 'character-spells__item';

		const name = document.createElement('div');
		name.className = 'character-spells__name';
		name.innerHTML = `[ENTITY:spell:${spell.spellInfo.spellName}]`;
		this.#placeholderProcessor.processEntityReferences(name);

		const meta = document.createElement('div');
		meta.className = 'character-spells__meta';

		const range = document.createElement('span');
		range.className = 'character-spells__range';
		range.textContent = spell.range;

		const slot = document.createElement('span');
		slot.className = 'character-spells__slot';
		slot.textContent = spell.slotType;

		const effect = document.createElement('span');
		effect.className = 'character-spells__effect';
		effect.textContent = spell.effect;

		meta.append(range, slot, effect);

		if (spell.spellInfo.spellMetaInfo) {
			const note = document.createElement('div');
			note.className = 'character-spells__note';
			note.textContent = spell.spellInfo.spellMetaInfo;
			meta.appendChild(note);
		}

		item.append(name, meta);
		return item;
	}
}
