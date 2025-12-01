// --- START OF FILE NPCTooltip.js ---

class NPCTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('npc', data);

		// Helper to safely get attribute text
		const getAttr = (key) => {
			if (!data.attributes) return null;
			// Case-insensitive check
			const match = Object.keys(data.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
			if (!match) return null;
			const val = data.attributes[match];
			return Array.isArray(val) ? val[0]?.value : val;
		};

		// Attributes
		const race = getAttr('race') || 'Unknown';
		const cls = getAttr('class') || 'NPC';
		const status = getAttr('status') || 'Active';
		const role = getAttr('role') || 'None';
		const faction = getAttr('faction') || getAttr('organization');
		const location = getAttr('location');
		const desc = data.description || getAttr('description') || 'No description available.';

		// Relationships (from view)
		let relationshipsHtml = '';
		if (data.relationships && Array.isArray(data.relationships) && data.relationships.length > 0) {
			const items = data.relationships
				.filter((rel) => rel.direction === 'outgoing') // Only show outgoing to avoid clutter
				.slice(0, 3) // Limit to 3 for tooltip
				.map((rel) => `<li><strong>${rel.type}:</strong> ${rel.entity_name}</li>`)
				.join('');
			if (items) {
				relationshipsHtml = `<div class="tooltip-container"><strong>Connections:</strong><ul>${items}</ul></div>`;
			}
		}

		return `
			<div class="entity-tooltip entity-npc-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="affinity-badge ${status.toLowerCase()}">${status}</span>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-meta">
						<span><strong>Race:</strong> ${race}</span>
						<span><strong>Class:</strong> ${cls}</span>
					</div>
					<div class="tooltip-container"><strong>Role:</strong> ${role}</div>
					${faction ? `<div class="tooltip-container"><strong>Faction:</strong> ${faction}</div>` : ''}
					${location ? `<div class="tooltip-container"><strong>Location:</strong> ${location}</div>` : ''}
					<div class="tooltip-container tooltip-desc">${desc.substring(0, 150)}${desc.length > 150 ? '...' : ''}</div>
					${relationshipsHtml}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
