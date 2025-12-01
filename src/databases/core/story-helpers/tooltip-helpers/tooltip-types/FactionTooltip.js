// --- START OF FILE FactionTooltip.js ---

class FactionTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('faction', data);

		const getAttr = (key) => {
			if (!data.attributes) return null;
			const match = Object.keys(data.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
			if (!match) return null;
			const val = data.attributes[match];
			return Array.isArray(val) ? val[0]?.value : val;
		};

		const type = getAttr('type') || 'Faction';
		const leader = getAttr('leader');
		const influence = getAttr('influence');

		return `
			<div class="entity-tooltip entity-faction-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="faction-type">${type}</span>
				</div>
				<div class="tooltip-content">
					${leader ? `<div><strong>Leader:</strong> ${leader}</div>` : ''}
					${influence ? `<div><strong>Influence:</strong> ${influence}</div>` : ''}
					<div class="tooltip-description">${data.description || ''}</div>
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
