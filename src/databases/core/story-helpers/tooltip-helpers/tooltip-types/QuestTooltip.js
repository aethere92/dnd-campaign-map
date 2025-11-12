class QuestTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('quest', data);
		const latestSession = data.sessions?.[data.sessions.length - 1];

		return `
			<div class="entity-tooltip entity-quest-tooltip">
				<div class="tooltip-header">
					<h3>${data.title}</h3>
					<span class="quest-status ${data.status?.toLowerCase()}">${data.status}</span>
				</div>
				<div class="tooltip-content">
					<div><strong>Priority:</strong> ${data.priority}</div>
					<div class="tooltip-objective"><strong>Current Objective:</strong> ${data.current_objective}</div>
					${
						latestSession
							? `<div class="tooltip-latest-update"><strong>Latest Update (Session ${latestSession.session}):</strong><p>${latestSession.description}</p></div>`
							: ''
					}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
