// --- START OF FILE QuestTooltip.js ---

class QuestTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('quest', data);

		// Core data usually comes from Quest table columns in the view or attributes
		const getAttr = (key) => {
			if (!data.attributes) return null;
			const match = Object.keys(data.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
			if (!match) return null;
			const val = data.attributes[match];
			return Array.isArray(val) ? val[0]?.value : val;
		};

		const status = getAttr('status') || 'Active';
		const priority = getAttr('priority') || 'Normal';

		// Note: 'events' in the view groups by macro type. We can look for 'quest' updates.
		let latestUpdate = '';
		if (data.events && data.events.quest && data.events.quest.length > 0) {
			// Events are sorted by date/order in the view, grab last one
			const last = data.events.quest[data.events.quest.length - 1];
			latestUpdate = last.description;
		}

		return `
			<div class="entity-tooltip entity-quest-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3> <!-- View uses 'name', table uses 'title' -->
					<span class="quest-status ${status.toLowerCase()}">${status}</span>
				</div>
				<div class="tooltip-content">
					<div><strong>Priority:</strong> ${priority}</div>
					<div class="tooltip-objective"><strong>Overview:</strong> ${data.description || ''}</div>
					${latestUpdate ? `<div class="tooltip-latest-update"><strong>Latest Update:</strong><p>${latestUpdate}</p></div>` : ''}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
