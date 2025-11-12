class RaceTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		return `
			<div class="entity-tooltip entity-race-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
				</div>
				<div class="tooltip-content">
					<div><strong>Size:</strong> ${data.size}</div>
					<div><strong>Speed:</strong> ${data.speed} ft.</div>
					${
						data.ability_bonuses?.length
							? `<div><strong>Ability Bonuses:</strong> ${data.ability_bonuses
									.map((ab) => `${ab.ability_score.name} +${ab.bonus}`)
									.join(', ')}</div>`
							: ''
					}
					${data.traits?.length ? `<div><strong>Traits:</strong> ${data.traits.map((t) => t.name).join(', ')}</div>` : ''}
				</div>
			</div>
		`;
	}
}
