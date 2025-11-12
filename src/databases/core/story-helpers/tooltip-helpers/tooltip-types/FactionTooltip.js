class FactionTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('faction', data);

		return `
			<div class="entity-tooltip entity-faction-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="faction-type">${data.type}</span>
				</div>
				<div class="tooltip-content">
					${
						data.location
							? `<div><strong>Location:</strong> ${data.location}${
									data.sublocation ? `: ${data.sublocation}` : ''
							  }</div>`
							: ''
					}
					${data.leader ? `<div><strong>Leader:</strong> ${data.leader}</div>` : ''}
					<div class="tooltip-description">${data.description}</div>
					${
						data.npcs?.length
							? `<div class="tooltip-features"><strong>NPCs:</strong><ul>${data.npcs
									.map((f) => `<li>${f}</li>`)
									.join('')}</ul></div>`
							: ''
					}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
