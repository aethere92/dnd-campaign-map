let MAP_DATABASE = null;
let currentPath = [];
let searchResults = new Set();

document.getElementById('new-item-dialog').querySelector('select').innerHTML = `
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
                ${Object.keys(PREDEFINED_SCHEMAS)
									.map((key) => `<option value="schema_${key}">${key} (Schema)</option>`)
									.join('')}
            `;

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
