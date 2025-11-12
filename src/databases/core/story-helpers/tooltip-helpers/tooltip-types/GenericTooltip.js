class GenericTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		return `
			<div class="entity-tooltip">
				<div class="tooltip-header">
					<h3>${data.name || data.title || 'Unknown'}</h3>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-description">${data.description || data.desc || JSON.stringify(data, null, 2)}</div>
				</div>
			</div>
		`;
	}
}
