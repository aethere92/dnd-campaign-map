// ============================================
// TooltipGeneratorFactory.js
// ============================================
class TooltipGeneratorFactory {
	constructor(dataRegistry, navigationLinkBuilder) {
		this.dataRegistry = dataRegistry;
		this.navigationLinkBuilder = navigationLinkBuilder;
		this.generators = new Map();
		this.#registerGenerators();
	}

	#registerGenerators() {
		this.generators.set('character', new CharacterTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('npc', new NPCTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('location', new LocationTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('faction', new FactionTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('quest', new QuestTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('encounter', new EncounterTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('spell', new SpellTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('monster', new MonsterTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('class', new ClassTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
		this.generators.set('race', new RaceTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder));
	}

	getGenerator(entityType) {
		return (
			this.generators.get(entityType) || new GenericTooltipGenerator(this.dataRegistry, this.navigationLinkBuilder)
		);
	}
}
