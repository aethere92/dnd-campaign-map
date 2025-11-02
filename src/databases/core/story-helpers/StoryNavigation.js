class StoryHelperNavigation {
	scrollToHash() {
		const hash = window.location.hash;
		if (!hash) return;

		try {
			const element = document.getElementById(hash.substring(1));
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 100);
			}
		} catch (e) {
			console.warn(`Could not scroll to element: ${hash}`, e);
		}
	}
}
