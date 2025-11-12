// ============================================
// NavigationLinkBuilder.js
// ============================================
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

		const urlMap = {
			character: (data) => `?campaign=${this.campaignId}&character=${encodeURIComponent(data.name)}`,
			npc: (data) => `?campaign=${this.campaignId}&view=npcs&npc=${encodeURIComponent(data.id)}`,
			location: (data) =>
				`?campaign=${this.campaignId}&view=locations&location=${encodeURIComponent(data.id || data.name)}`,
			quest: (data) => `?campaign=${this.campaignId}&view=quests&quest=${encodeURIComponent(data.title)}`,
			faction: (data) =>
				`?campaign=${this.campaignId}&view=factions&faction=${encodeURIComponent(data.id || data.name)}`,
			encounter: (data) =>
				`?campaign=${this.campaignId}&view=encounters&encounter=${encodeURIComponent(data.id || data.name)}`,
		};

		const urlGenerator = urlMap[entityType];
		return urlGenerator ? urlGenerator(data) : null;
	}
}
