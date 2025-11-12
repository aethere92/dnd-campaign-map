// ============================================
// StoryHelperTooltip.js (Main Class)
// ============================================
class StoryHelperTooltip {
	#tooltipContainer;
	#dataService;
	#generatorFactory;
	#positioner;
	#campaignId;

	constructor(campaignData = {}, supabaseClient = null) {
		this.#campaignId = campaignData.campaignId;

		const dataRegistry = this.#buildDataRegistry(campaignData);
		const supabase = supabaseClient || SupabaseClient.getInstance();
		const apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/';

		this.#dataService = new TooltipDataService(dataRegistry, supabase, apiBaseUrl);

		const navigationLinkBuilder = new NavigationLinkBuilder(this.#campaignId);
		this.#generatorFactory = new TooltipGeneratorFactory(dataRegistry, navigationLinkBuilder);

		this.#positioner = new TooltipPositioner();
		this.#createTooltipContainer();
	}

	#buildDataRegistry(campaignData) {
		const registry = {
			character: {},
			npc: {},
			location: {},
			faction: {},
			guild: {},
			quest: {},
			item: {},
			encounter: {},
			spell: {},
			monster: {},
			class: {},
			race: {},
			equipment: {},
			condition: {},
			feat: {},
		};

		if (campaignData.characters) {
			campaignData.characters.forEach((char) => {
				const key = char.name.toLowerCase();
				registry.character[key] = char;
			});
		}

		if (campaignData.npcs) {
			campaignData.npcs.forEach((npc) => {
				const key = npc.name.toLowerCase();
				registry.npc[key] = npc;
				registry.npc[npc.id] = npc;
			});
		}

		if (campaignData.locations) {
			campaignData.locations.forEach((loc) => {
				const key = loc.name.toLowerCase();
				registry.location[key] = loc;
				if (loc.id) registry.location[loc.id] = loc;
			});
		}

		if (campaignData.quests) {
			campaignData.quests.forEach((quest) => {
				const key = quest.title.toLowerCase();
				registry.quest[key] = quest;
				if (quest.id) registry.quest[quest.id] = quest;
			});
		}

		if (campaignData.factions) {
			campaignData.factions.forEach((faction) => {
				const key = faction.name.toLowerCase();
				registry.faction[key] = faction;
				if (faction.id) registry.faction[faction.id] = faction;
			});
		}

		if (campaignData.encounters) {
			campaignData.encounters.forEach((enc) => {
				const key = enc.name.toLowerCase();
				registry.encounter[key] = enc;
				if (enc.id) registry.encounter[enc.id] = enc;
			});
		}

		if (typeof DND_SPELL_DB !== 'undefined' && DND_SPELL_DB) {
			DND_SPELL_DB.forEach((spell) => {
				const key = spell.spellName.toLowerCase();
				registry.spell[key] = spell;
				if (spell.id) registry.spell[spell.id] = spell;
			});
		}

		if (campaignData.monsters) {
			campaignData.monsters.forEach((monster) => {
				const key = monster.name.toLowerCase();
				registry.monster[key] = monster;
				if (monster.id) registry.monster[monster.id] = monster;
			});
		}

		return registry;
	}

	#createTooltipContainer() {
		this.#tooltipContainer = document.getElementById('character-tooltip-container');

		if (!this.#tooltipContainer) {
			this.#tooltipContainer = document.createElement('div');
			this.#tooltipContainer.id = 'character-tooltip-container';
			this.#tooltipContainer.className = 'character-tooltip-container';
			Object.assign(this.#tooltipContainer.style, {
				position: 'absolute',
				zIndex: '1000',
				display: 'none',
			});
			document.body.appendChild(this.#tooltipContainer);
		}
	}

	addTooltip(element, entityType, entityName) {
		element.classList.add(`entity-${entityType}`);
		element.style.cursor = 'help';

		let hideTimeout;

		const showTooltip = async (e) => {
			e.stopPropagation();
			clearTimeout(hideTimeout);
			await this.#showTooltip(element, entityType, entityName);
		};

		const hideTooltip = () => {
			hideTimeout = setTimeout(() => {
				this.#tooltipContainer.style.display = 'none';
			}, 300);
		};

		const keepTooltip = () => {
			clearTimeout(hideTimeout);
		};

		element.addEventListener('mouseover', showTooltip);
		element.addEventListener('mouseout', hideTooltip);
		this.#tooltipContainer.addEventListener('mouseover', keepTooltip);
		this.#tooltipContainer.addEventListener('mouseout', hideTooltip);
	}

	async #showTooltip(element, entityType, entityName) {
		this.#showLoading(entityName);
		this.#tooltipContainer.style.display = 'block';
		this.#positioner.position(this.#tooltipContainer, element);

		try {
			const entityData = await this.#dataService.fetch(entityType, entityName);

			if (entityData) {
				const generator = this.#generatorFactory.getGenerator(entityType);
				this.#tooltipContainer.innerHTML = generator.generate(entityData);
				this.#positioner.position(this.#tooltipContainer, element);
			} else {
				this.#showError(entityName, entityType);
			}
		} catch (error) {
			this.#showError(entityName, entityType, error);
			console.error('Error fetching entity data:', error);
		}
	}

	#showLoading(entityName) {
		this.#tooltipContainer.innerHTML = `
			<div class="entity-tooltip loading">
				<div class="tooltip-header">
					<h3>${entityName}</h3>
				</div>
				<div class="tooltip-content">
					<div>Loading...</div>
				</div>
			</div>
		`;
	}

	#showError(entityName, entityType, error = null) {
		const message = error
			? `Error loading information: ${error.message}`
			: `No information found for this ${entityType}.`;

		this.#tooltipContainer.innerHTML = `
			<div class="entity-tooltip error">
				<div class="tooltip-header">
					<h3>${entityName}</h3>
				</div>
				<div class="tooltip-content">
					<div>${message}</div>
				</div>
			</div>
		`;
	}

	get dataRegistry() {
		return this.#dataService.dataRegistry;
	}

	get supabaseClient() {
		return this.#dataService.supabaseClient;
	}
}
