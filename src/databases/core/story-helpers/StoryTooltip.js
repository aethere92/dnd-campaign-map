// --- START OF FILE StoryTooltip.js ---

class StoryHelperTooltip {
	#tooltipContainer;
	#dataService;
	#generatorFactory;
	#positioner;
	#campaignId;

	constructor(contextData = {}, supabaseClient = null) {
		this.#campaignId = contextData.campaignId;
		const supabase = supabaseClient || SupabaseClient.getInstance();
		const apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/';

		// Initialize services
		this.#dataService = new TooltipDataService(this.#campaignId, supabase, apiBaseUrl);
		const navigationLinkBuilder = new NavigationLinkBuilder(this.#campaignId);
		this.#generatorFactory = new TooltipGeneratorFactory(navigationLinkBuilder);
		this.#positioner = new TooltipPositioner();

		this.#createTooltipContainer();
	}

	addTooltip(element, entityType, entityName) {
		if (!element || !entityType || !entityName) return;

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
				if (this.#tooltipContainer) {
					this.#tooltipContainer.style.display = 'none';
				}
			}, 300);
		};

		const keepTooltip = () => {
			clearTimeout(hideTimeout);
		};

		element.addEventListener('mouseover', showTooltip);
		element.addEventListener('mouseout', hideTooltip);

		if (this.#tooltipContainer) {
			this.#tooltipContainer.addEventListener('mouseover', keepTooltip);
			this.#tooltipContainer.addEventListener('mouseout', hideTooltip);
		}
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
				// Reposition after content load in case size changed
				this.#positioner.position(this.#tooltipContainer, element);
			} else {
				this.#showError(entityName, entityType);
			}
		} catch (error) {
			this.#showError(entityName, entityType, error);
			console.error('Error fetching entity data:', error);
		}
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

	#showLoading(entityName) {
		this.#tooltipContainer.innerHTML = `
			<div class="entity-tooltip loading">
				<div class="tooltip-header"><h3>${entityName}</h3></div>
				<div class="tooltip-content">Loading...</div>
			</div>
		`;
	}

	#showError(entityName, entityType, error = null) {
		const message = error ? error.message : `No information found.`;
		this.#tooltipContainer.innerHTML = `
			<div class="entity-tooltip error">
				<div class="tooltip-header"><h3>${entityName}</h3></div>
				<div class="tooltip-content">${message}</div>
			</div>
		`;
	}
}
