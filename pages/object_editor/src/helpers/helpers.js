function updateValue(path, value) {
	let current = MAP_DATABASE;
	for (let i = 0; i < path.length - 1; i++) {
		current = current[path[i]];
	}
	current[path[path.length - 1]] = value;
}

function updateKey(path, newKey) {
	let current = MAP_DATABASE;
	for (let i = 0; i < path.length - 1; i++) {
		current = current[path[i]];
	}
	const oldKey = path[path.length - 1];
	if (oldKey !== newKey) {
		current[newKey] = current[oldKey];
		delete current[oldKey];
	}
}

// Helper function to automatically expand all nodes of a newly created schema object
function expandAllNodes(element) {
	if (!element) return;

	const nested = element.querySelector('.nested');
	if (nested) {
		nested.classList.remove('collapsed');
		const icon = element.querySelector('.nav-icon');
		if (icon) icon.textContent = '▼';

		// Recursively expand all child nodes
		const children = nested.querySelectorAll('.object-editor');
		children.forEach((child) => expandAllNodes(child));
	}
}

// Modify the createObjectEditor function to auto-expand schema objects
const originalCreateObjectEditor = createObjectEditor;
createObjectEditor = function (obj, key, path) {
	const element = originalCreateObjectEditor(obj, key, path);

	// If this is a schema object (has multiple nested properties), auto-expand it
	if (obj && typeof obj === 'object' && Object.keys(obj).length > 2) {
		expandAllNodes(element);
	}

	return element;
};
