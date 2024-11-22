// Search functionality
function handleSearch(event) {
	const searchTerm = event.target.value.toLowerCase();
	searchResults.clear();

	if (searchTerm) {
		searchInObject(MAP_DATABASE, [], searchTerm);
		highlightSearchResults();
	} else {
		clearHighlights();
	}
}

function searchInObject(obj, path, term) {
	if (!obj) return;

	Object.entries(obj).forEach(([key, value]) => {
		const currentPath = [...path, key];

		if (key.toLowerCase().includes(term) || (typeof value === 'string' && value.toLowerCase().includes(term))) {
			searchResults.add(currentPath.join('.'));
		}

		if (typeof value === 'object' && value !== null) {
			searchInObject(value, currentPath, term);
		}
	});
}

function highlightSearchResults() {
	document.querySelectorAll('.object-editor, .value-editor').forEach((elem) => {
		elem.style.opacity = '0.5';
	});

	searchResults.forEach((path) => {
		const elem = document.querySelector(`[data-path="${path}"]`);
		if (elem) {
			elem.style.opacity = '1';
			elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
}

function clearHighlights() {
	document.querySelectorAll('.object-editor, .value-editor').forEach((elem) => {
		elem.style.opacity = '1';
	});
}
