// --- START OF FILE LocationTooltip.js ---

class LocationTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('location', data);

		const getAttr = (key) => {
			if (!data.attributes) return null;
			const match = Object.keys(data.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
			if (!match) return null;
			const val = data.attributes[match];
			return Array.isArray(val) ? val[0]?.value : val;
		};

		const type = getAttr('type') || 'Location';
		const region = getAttr('region');
		const pop = getAttr('population');
		const ruler = getAttr('ruler');
		const desc = data.description || getAttr('description') || '';

		return `
			<div class="entity-tooltip entity-location-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="location-type">${type}</span>
				</div>
				<div class="tooltip-content">
					${region ? `<div><strong>Region:</strong> ${region}</div>` : ''}
					${pop ? `<div><strong>Population:</strong> ${pop}</div>` : ''}
					${ruler ? `<div><strong>Ruler:</strong> ${ruler}</div>` : ''}
					<div class="tooltip-description">${desc.substring(0, 200)}${desc.length > 200 ? '...' : ''}</div>
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
