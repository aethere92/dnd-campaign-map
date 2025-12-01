// --- START OF FILE TooltipGeneratorFactory.js ---

class TooltipGeneratorFactory {
	constructor(navigationLinkBuilder) {
		this.navigationLinkBuilder = navigationLinkBuilder;
		this.generators = new Map();
		this.#registerGenerators();
	}

	#registerGenerators() {
		this.generators.set('character', new CharacterTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('npc', new NPCTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('location', new LocationTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('faction', new FactionTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('quest', new QuestTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('encounter', new EncounterTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('spell', new SpellTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('monster', new MonsterTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('class', new ClassTooltipGenerator(this.navigationLinkBuilder));
		this.generators.set('race', new RaceTooltipGenerator(this.navigationLinkBuilder));
	}

	getGenerator(entityType) {
		return this.generators.get(entityType) || new GenericTooltipGenerator(this.navigationLinkBuilder);
	}
}
