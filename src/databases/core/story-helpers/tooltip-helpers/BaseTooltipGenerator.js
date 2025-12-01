// --- START OF FILE BaseTooltipGenerator.js ---

class BaseTooltipGenerator {
	constructor(navigationLinkBuilder) {
		this.navigationLinkBuilder = navigationLinkBuilder;
	}

	generate(data) {
		throw new Error('generate() must be implemented by subclass');
	}
}
