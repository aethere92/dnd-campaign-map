class ClassTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		return `
			<div class="entity-tooltip entity-class-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
				</div>
				<div class="tooltip-content">
					<div><strong>Hit Die:</strong> d${data.hit_die}</div>
					<div><strong>Primary Ability:</strong> ${data.saving_throws?.map((s) => s.name).join(', ')}</div>
					${
						data.proficiencies?.length
							? `<div><strong>Proficiencies:</strong> ${data.proficiencies
									.slice(0, 5)
									.map((p) => p.name)
									.join(', ')}${data.proficiencies.length > 5 ? '...' : ''}</div>`
							: ''
					}
					${
						data.spellcasting
							? `<div><strong>Spellcasting Ability:</strong> ${data.spellcasting.spellcasting_ability?.name}</div>`
							: ''
					}
				</div>
			</div>
		`;
	}
}
