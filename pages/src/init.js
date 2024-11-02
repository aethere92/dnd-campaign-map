let MAP_DATABASE = null;
let currentPath = [];
let searchResults = new Set();

// Show import dialog
function showImportDialog() {
	document.getElementById('import-dialog').showModal();
}

// Enhanced editor initialization
function initEditor() {
	const editorElement = document.getElementById('editor');
	editorElement.innerHTML = '';
	editorElement.appendChild(createObjectEditor(MAP_DATABASE, 'MAP_DATABASE', []));
	updateNavigationTree();
	updateBreadcrumb();
}

// Initialize with empty data
initEditor({ MAP_DATABASE: {} });
