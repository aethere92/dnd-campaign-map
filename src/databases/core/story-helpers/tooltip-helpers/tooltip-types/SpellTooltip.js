class SpellTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		return `
			<div class="entity-tooltip entity-spell-tooltip">
				<div class="tooltip-header">
					<h3>${data.spellName}</h3>
					<span class="spell-level">Level ${data.level == 0 ? 'Cantrip' : data?.level ?? 'Cantrip'}</span>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-meta">
						<span><strong>School:</strong> ${data.spellClass || 'Unknown'}</span>
						<span><strong>Casting Time:</strong> ${data.castingTime}</span>
						<span><strong>Range:</strong> ${data.range}</span>
					</div>
					<div><strong>Components:</strong> ${data?.components}</div>
					<div><strong>Duration:</strong> ${data.duration}</div>
					${data.classes?.length ? `<div><strong>Classes:</strong> ${data.classes.join(', ')}</div>` : ''}
					<div class="tooltip-description">${data?.description || 'No description available.'}</div>
					<div><strong>Source:</strong> ${data?.source || 'No source available.'}</div>
				</div>
			</div>
		`;
	}
}
