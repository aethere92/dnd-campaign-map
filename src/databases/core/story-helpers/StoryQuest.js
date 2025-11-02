class StoryHelperQuest extends StoryHelperBase {
	#priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };

	getUrlParam() {
		return 'quest'; // URL: ?quest=The%20Lost%20Artifact
	}

	getItems() {
		return this.campaign?.quests;
	}

	getViewTitle() {
		return 'Quest Log';
	}

	getItemId(quest) {
		return quest.title;
	}

	groupItems(quests) {
		const grouped = {
			'Active Quests': [],
			'Completed Quests': [],
			'Failed Quests': [],
			'Other Quests': [],
		};

		quests.forEach((quest) => {
			const status = quest.status || 'Other';
			const key = `${status} Quests`;
			if (grouped[key]) {
				grouped[key].push(quest);
			} else {
				grouped['Other Quests'].push(quest);
			}
		});

		// Sort each group by priority
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => {
				const aPriority = this.#priorityOrder[a.priority?.toLowerCase()] ?? 999;
				const bPriority = this.#priorityOrder[b.priority?.toLowerCase()] ?? 999;
				return aPriority - bPriority;
			});
		});

		// Remove empty groups
		Object.keys(grouped).forEach((key) => {
			if (!grouped[key].length) {
				delete grouped[key];
			}
		});

		return grouped;
	}

	createListItem(quest, detailPanel) {
		const item = super.createListItem(quest, detailPanel);
		item.classList.add(`status-${quest.status.toLowerCase()}`);
		return item;
	}

	createListItemContent(quest) {
		const container = document.createElement('div');

		const priority = document.createElement('span');
		priority.className = `view-item-icon priority-${quest.priority.toLowerCase()}`;
		priority.textContent = this.getPrioritySymbol(quest.priority);

		const title = document.createElement('span');
		title.className = 'view-item-name';
		title.textContent = quest.title;

		container.append(priority, title);
		return container;
	}

	getPrioritySymbol(priority) {
		const symbols = {
			critical: '!!!',
			high: '!!',
			normal: '!',
			low: '·',
		};
		return symbols[priority?.toLowerCase()] || '!';
	}

	createDetailContent(quest) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		// Header
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const title = document.createElement('h3');
		title.className = 'view-detail-name';
		title.textContent = quest.title;

		const metaTags = [
			{ className: `priority priority-${quest.priority.toLowerCase()}`, text: `${quest.priority} Priority` },
			{ className: `status status-${quest.status.toLowerCase()}`, text: quest.status },
		];

		header.appendChild(title);
		header.appendChild(this.createMetaTags(metaTags));
		detail.appendChild(header);

		// Current objective
		if (quest.current_objective) {
			detail.appendChild(this.createSection('Objective', quest.current_objective, 'objective-text'));
		}

		// Quest History
		if (quest.sessions?.length) {
			detail.appendChild(this.createQuestHistorySection(quest.sessions));
		}

		return detail;
	}

	createQuestHistorySection(sessions) {
		const content = document.createElement('div');
		content.className = 'view-timeline';

		sessions.forEach((session) => {
			const card = this.createSessionCard(session);
			content.appendChild(card);
		});

		return this.createSection('Quest Progress', content);
	}

	createSessionCard(session) {
		const card = document.createElement('div');
		card.className = 'view-card';

		const header = document.createElement('div');
		header.className = 'view-card-header';
		header.textContent = `Session ${session.session || 'Unknown'}`;
		card.appendChild(header);

		if (session.description) {
			const desc = document.createElement('p');
			desc.className = 'view-card-text';
			desc.textContent = session.description;
			card.appendChild(desc);
		}

		if (session.details?.length) {
			const list = this.createSimpleList(session.details);
			card.appendChild(list);
		}

		if (session.visions?.length) {
			card.appendChild(this.createVisionsSubsection(session.visions));
		}

		if (session.recurring_elements) {
			card.appendChild(this.createRecurringElementsSubsection(session.recurring_elements));
		}

		if (session.first_countermeasure?.length) {
			card.appendChild(this.createCardSubsection('First Countermeasure', session.first_countermeasure));
		}

		if (session.allied_forces?.length) {
			card.appendChild(this.createCardSubsection('Allied Forces', session.allied_forces));
		}

		if (session.threat_assessment) {
			const threat = document.createElement('div');
			threat.className = 'view-card-highlight';
			threat.innerHTML = `<strong>Threat Assessment:</strong> ${session.threat_assessment}`;
			this.placeholderProcessor.processEntityReferences(threat);
			card.appendChild(threat);
		}

		return card;
	}

	createSimpleList(items) {
		const ul = document.createElement('ul');
		ul.className = 'view-simple-list';
		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = item;
			ul.appendChild(li);
		});
		return ul;
	}

	createCardSubsection(title, items) {
		const section = document.createElement('div');
		section.className = 'view-card-subsection';

		const header = document.createElement('h5');
		header.className = 'view-card-subsection-title';
		header.textContent = title;
		section.appendChild(header);

		const list = this.createSimpleList(items);
		section.appendChild(list);

		return section;
	}

	createVisionsSubsection(visions) {
		const section = document.createElement('div');
		section.className = 'view-card-subsection';

		const header = document.createElement('h5');
		header.className = 'view-card-subsection-title';
		header.textContent = 'Visions';
		section.appendChild(header);

		visions.forEach((vision) => {
			const visionCard = document.createElement('div');
			visionCard.className = 'view-card-nested';

			const characters = document.createElement('div');
			characters.className = 'view-card-label';
			characters.innerHTML = `<strong>Characters:</strong> ${vision.characters.join(', ')}`;

			const visionText = document.createElement('p');
			visionText.className = 'view-card-text';
			visionText.textContent = vision.vision;

			this.placeholderProcessor.processEntityReferences(characters);
			visionCard.append(characters, visionText);
			section.appendChild(visionCard);
		});

		return section;
	}

	createRecurringElementsSubsection(elements) {
		const section = document.createElement('div');
		section.className = 'view-card-subsection';

		const header = document.createElement('h5');
		header.className = 'view-card-subsection-title';
		header.textContent = 'Recurring Elements';
		section.appendChild(header);

		const elementMap = {
			unifying_banner: 'Unifying Banner',
			alliance: 'Alliance',
			pivotal_event: 'Pivotal Event',
			strategy: 'Strategy',
		};

		Object.entries(elementMap).forEach(([key, label]) => {
			const value = elements[key];
			if (value) {
				const div = document.createElement('div');
				div.className = 'view-card-detail';
				if (Array.isArray(value)) {
					div.innerHTML = `<strong>${label}:</strong> ${value.join(', ')}`;
				} else {
					div.innerHTML = `<strong>${label}:</strong> ${value}`;
				}
				this.placeholderProcessor.processEntityReferences(div);
				section.appendChild(div);
			}
		});

		return section;
	}
}
