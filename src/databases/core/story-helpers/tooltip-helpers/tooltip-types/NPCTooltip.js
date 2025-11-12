class NPCTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('npc', data);

		const relationships =
			data.relationships
				?.map((rel) => {
					const relatedNpc = this.dataRegistry.npc[rel.npcId];
					return `<li><strong>${rel.type}:</strong> ${relatedNpc?.name || rel.npcId} - ${rel.description}</li>`;
				})
				.join('') || '';

		return `
			<div class="entity-tooltip entity-npc-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="affinity-badge ${data.affinity?.toLowerCase()}">${data.affinity}</span>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-meta">
						<span><strong>Race:</strong> ${data.race}</span>
						<span><strong>Class:</strong> ${data.class}</span>
						<span><strong>Status:</strong> ${data.status}</span>
					</div>
					<div class="tooltip-container"><strong>Role:</strong> ${data.role}</div>
					${data.faction ? `<div class="tooltip-container"><strong>Faction:</strong> ${data.faction}</div>` : ''}
					<div class="tooltip-container">${data.description}</div>
					${data.personality ? `<div class="tooltip-container"><strong>Personality:</strong> ${data.personality}</div>` : ''}
					${relationships ? `<div class="tooltip-container"><strong>Relationships:</strong><ul>${relationships}</ul></div>` : ''}
					${
						data.location
							? `<div class="tooltip-container"><strong>Location:</strong> ${data.location.primary}${
									data.location.specific ? ` (${data.location.specific})` : ''
							  }</div>`
							: ''
					}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
