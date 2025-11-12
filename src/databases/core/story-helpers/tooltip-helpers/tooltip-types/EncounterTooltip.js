class EncounterTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('encounter', data);

		let locationName = data.location;
		if (locationName && this.dataRegistry.location[locationName]) {
			locationName = this.dataRegistry.location[locationName].name;
		} else if (locationName && this.dataRegistry.location[locationName.toLowerCase()]) {
			locationName = this.dataRegistry.location[locationName.toLowerCase()].name;
		}

		const outcome = data.outcome || {};
		const status = outcome.status || data.status;

		const renderList = (title, items) => {
			if (!items || items.length === 0) return '';
			const cleanItem = (item) => item.replace(/\[ENTITY:.*?:(.*?)]/, '$1');
			const listItems = items.map((item) => `<li>${cleanItem(item)}</li>`).join('');
			return `<div class="tooltip-list"><strong>${title}:</strong><ul>${listItems}</ul></div>`;
		};

		const initiativeList = this.#generateInitiativeList(data.initiative);
		const enemiesList = renderList('Enemies Defeated', outcome.enemiesDefeated);
		const casualtiesList = renderList('Casualties', outcome.casualties);
		const itemsList = renderList('Items Obtained', outcome.itemsObtained);
		const complicationsList = renderList('Complications', outcome.complications);

		return `
			<div class="entity-tooltip entity-encounter-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					${status ? `<span class="encounter-status ${status.toLowerCase()}">${status}</span>` : ''}
				</div>
				<div class="tooltip-content">
					${locationName ? `<div><strong>Location:</strong> ${locationName}</div>` : ''}
					${data.rounds ? `<div><strong>Duration:</strong> ${data.rounds.length} rounds</div>` : ''}
					${outcome.partyCondition ? `<div><strong>Party Condition:</strong> ${outcome.partyCondition}</div>` : ''}
					${data.description ? `<div class="tooltip-description">${data.description}</div>` : ''}
					${initiativeList}
					${enemiesList}
					${casualtiesList}
					${itemsList}
					${complicationsList}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}

	#generateInitiativeList(initiative) {
		if (!initiative || initiative.length === 0) return '';

		const cleanName = (name) => name.replace(/\[ENTITY:.*?:(.*?)]/, '$1');

		const listItems = initiative
			.map((item) => {
				const name = cleanName(item.character);
				const value = item.value ? `(Initiative: ${item.value})` : '';
				const notes = item.notes ? `- ${item.notes}` : '';
				return `<li><strong>${name}</strong> ${value} ${notes}</li>`;
			})
			.join('');

		return `<div class="tooltip-list"><strong>Participants:</strong><ul>${listItems}</ul></div>`;
	}
}
