// --- START OF FILE NavigationLinkBuilder.js ---

class NavigationLinkBuilder {
	constructor(campaignId) {
		this.campaignId = campaignId;
	}

	build(entityType, data) {
		const url = this.#generateUrl(entityType, data);
		if (!url) return '';

		return `
			<div class="tooltip-navigation">
				<a href="${url}" class="tooltip-nav-link" onclick="event.stopPropagation();">
					<span class="tooltip-nav-icon">→</span>
					View Full Details
				</a>
			</div>
		`;
	}

	#generateUrl(entityType, data) {
		if (!this.campaignId) return null;
		const id = data.id || data.name; // Fallback to name if ID missing, though ID preferred

		const urlMap = {
			character: () => `?campaign=${this.campaignId}&character=${encodeURIComponent(data.name)}`,
			npc: () => `?campaign=${this.campaignId}&view=npcs&npc=${encodeURIComponent(id)}`,
			location: () => `?campaign=${this.campaignId}&view=locations&location=${encodeURIComponent(id)}`,
			quest: () => `?campaign=${this.campaignId}&view=quests&quest=${encodeURIComponent(id)}`,
			faction: () => `?campaign=${this.campaignId}&view=factions&faction=${encodeURIComponent(id)}`,
			encounter: () => `?campaign=${this.campaignId}&view=encounters&encounter=${encodeURIComponent(id)}`,
		};

		return urlMap[entityType] ? urlMap[entityType]() : null;
	}
}
