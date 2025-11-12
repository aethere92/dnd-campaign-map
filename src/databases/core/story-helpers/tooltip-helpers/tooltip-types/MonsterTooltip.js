class MonsterTooltipGenerator extends BaseTooltipGenerator {
	generate(data) {
		const traits = typeof data.traits === 'string' ? JSON.parse(data.traits) : data.traits || [];
		const actions = typeof data.actions === 'string' ? JSON.parse(data.actions) : data.actions || [];

		const abilityScoresDisplay = this.#generateAbilityScoresFromMonster(data);

		const speedDisplay =
			typeof data.speed === 'object'
				? Object.entries(data.speed)
						.map(([k, v]) => `${k} ${v}`)
						.join(', ')
				: data.speed || 'Unknown';

		const traitsHtml =
			traits.length > 0
				? `<div class="tooltip-section"><strong>Special Traits:</strong><ul>${traits
						.map((t) => `<li><strong>${t.name}:</strong> ${t.description}</li>`)
						.join('')}</ul></div>`
				: '';

		const actionsHtml =
			actions.length > 0
				? `<div class="tooltip-section"><strong>Actions:</strong><ul>${actions
						.slice(0, 3)
						.map((a) => `<li><strong>${a.name}:</strong> ${a.description}</li>`)
						.join('')}${actions.length > 3 ? '<li><em>...and more</em></li>' : ''}</ul></div>`
				: '';

		return `
			<div class="entity-tooltip entity-monster-tooltip">
				<div class="tooltip-header">
					<h3>${data.name}</h3>
					<span class="monster-cr">CR ${data.challenge_rating || data.challenge || '?'}</span>
				</div>
				<div class="tooltip-content">
					<div class="tooltip-meta">
						<span><strong>Type:</strong> ${data.type || data.meta || 'Unknown'}</span>
						<span><strong>Size:</strong> ${data.size || 'Unknown'}</span>
						<span><strong>Alignment:</strong> ${data.alignment || 'Unaligned'}</span>
					</div>
					<div class="tooltip-stats">
						<span><strong>AC:</strong> ${data.armor_class || '10'}</span>
						<span><strong>HP:</strong> ${data.hit_points || '?'}</span>
						<span><strong>Speed:</strong> ${speedDisplay}</span>
					</div>
					${abilityScoresDisplay}
					${data.skills ? `<div><strong>Skills:</strong> ${data.skills}</div>` : ''}
					${data.senses ? `<div><strong>Senses:</strong> ${data.senses}</div>` : ''}
					${data.languages ? `<div><strong>Languages:</strong> ${data.languages}</div>` : ''}
					${traitsHtml}
					${actionsHtml}
				</div>
			</div>
		`;
	}

	#generateAbilityScoresFromMonster(monster) {
		const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
		const scoreElements = abilities
			.map((ability) => {
				const score = monster[ability] || monster[ability.toUpperCase()];
				if (!score) return '';
				return `<div class="ability-score"><span class="ability-name">${ability.toUpperCase()}</span><span class="ability-value">${score}</span></div>`;
			})
			.filter(Boolean)
			.join('');

		return scoreElements ? `<div class="tooltip-ability-scores">${scoreElements}</div>` : '';
	}
}
