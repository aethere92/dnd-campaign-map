// --- START OF FILE StoryPlaceholder.js ---

class StoryHelperPlaceholder {
	#tooltipManager;
	#campaignContext;

	constructor(tooltipManager, campaignContext) {
		this.#tooltipManager = tooltipManager;
		this.#campaignContext = campaignContext;
	}

	processAll(element, sessionData) {
		this.processEntityReferences(element);
		// Add other processors (images, progression) here as needed
	}

	processEntityReferences(element) {
		if (!element) return;
		const html = element.innerHTML;
		// Regex for [ENTITY:type:value]
		const newHtml = html.replace(/\[ENTITY:(\w+):([^\]]+)\]/g, (match, type, value) => {
			return `<span class="entity-link" data-type="${type}" data-value="${value}">${value}</span>`;
		});

		if (html !== newHtml) {
			element.innerHTML = newHtml;
			// Re-bind tooltips
			element.querySelectorAll('.entity-link').forEach((el) => {
				el.onclick = () => {
					// Handle navigation or tooltip
					console.log(`Clicked ${el.dataset.type}: ${el.dataset.value}`);
				};
				// Attach tooltip logic here
			});
		}
	}

	processTimelinePlaceholders(container) {
		this.processEntityReferences(container);
	}
}
