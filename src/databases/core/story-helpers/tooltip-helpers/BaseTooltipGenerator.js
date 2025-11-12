// ============================================
// Tooltip Generators (Base and Concrete)
// ============================================
class BaseTooltipGenerator {
	constructor(dataRegistry, navigationLinkBuilder) {
		this.dataRegistry = dataRegistry;
		this.navigationLinkBuilder = navigationLinkBuilder;
	}

	generate(data) {
		throw new Error('generate() must be implemented by subclass');
	}

	generateAbilityScores(scores) {
		if (!scores) return '';

		const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
		const scoreElements = abilities
			.map((ability) => {
				const score = scores[ability] || scores[ability.toLowerCase()];
				if (!score) return '';
				return `<div class="ability-score"><span class="ability-name">${ability}</span><span class="ability-value">${score}</span></div>`;
			})
			.filter(Boolean)
			.join('');

		return scoreElements ? `<div class="tooltip-ability-scores">${scoreElements}</div>` : '';
	}
}
