class LocationTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const navLink = this.navigationLinkBuilder.build('location', data);

		return `
			<div class="entity-tooltip entity-location-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="location-type">${data.type}</span>
				</div>
				<div class="tooltip-content">
					${data.region ? `<div><strong>Region:</strong> ${data.region}</div>` : ''}
					${data.population ? `<div><strong>Population:</strong> ${data.population}</div>` : ''}
					${data.ruler ? `<div><strong>Ruler:</strong> ${data.ruler}</div>` : ''}
					<div class="tooltip-description">${data.description}</div>
					${
						data.features?.length
							? `<div class="tooltip-features"><strong>Features:</strong><ul>${data.features
									.map((f) => `<li>${f}</li>`)
									.join('')}</ul></div>`
							: ''
					}
					${
						data.threats?.length
							? `<div class="tooltip-threats"><strong>Threats:</strong><ul>${data.threats
									.map((t) => `<li>${t}</li>`)
									.join('')}</ul></div>`
							: ''
					}
				</div>
				<div class="tooltip-footer">${navLink}</div>
			</div>
		`;
	}
}
