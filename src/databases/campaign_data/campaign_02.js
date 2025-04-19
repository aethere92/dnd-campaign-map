// Initialize the story view
document.addEventListener('DOMContentLoaded', () => {
	const storyView = new StoryView('story-container', {
		campaignData: CAMPAIGN_DATA,
		isDebugMode: false,
	});
});
