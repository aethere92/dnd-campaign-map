class CharacterTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('character', data);

		return `
			<div class="entity-tooltip entity-character-tooltip">
				<div class="tooltip-header">
					${data.icon ? `<img src="${data.icon}" alt="${data.name}" />` : ''}
					<h3>${data.name}</h3>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-meta">
						<span><strong>Race:</strong> ${data.race}</span>
						<span><strong>Class:</strong> ${data.class}</span>
						<span><strong>Level:</strong> ${data.level}</span>
					</div>
					${this.generateAbilityScores(data.stats?.abilityScores)}
					<div class="tooltip-description">${data.shortDescription || ''}</div>
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
