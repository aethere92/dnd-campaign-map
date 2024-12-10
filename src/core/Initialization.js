document.addEventListener('DOMContentLoaded', async () => {
	const campaignManager = new CampaignManager('root', false);

	// Toggle menu
	const menuToggle = document.querySelector('.menu-toggle');
	const menuContent = document.querySelector('.menu-content');

	menuToggle.addEventListener('click', () => {
		menuContent.classList.toggle('active');
	});

	// Prevent menu from closing when interacting with it
	menuContent.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		// Only close if clicking outside menu and not dragging map
		if (!e.target.closest('.action-menu') && e.type === 'click') {
			menuContent.classList.remove('active');
		}
	});
});
