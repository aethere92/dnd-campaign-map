function createObjectEditor(obj, key, path) {
	const container = document.createElement('div');
	container.className = 'object-editor';
	container.setAttribute('data-path', path.join('.'));

	const header = document.createElement('div');
	header.className = 'header';

	const collapseIcon = document.createElement('span');
	collapseIcon.className = 'nav-icon';
	collapseIcon.textContent = '▼';
	header.appendChild(collapseIcon);

	const keySpan = document.createElement('span');
	keySpan.className = 'key';
	keySpan.textContent = key;
	keySpan.setAttribute('contenteditable', true);
	header.appendChild(keySpan);

	const typeSpan = document.createElement('span');
	typeSpan.className = 'type';
	typeSpan.textContent = Array.isArray(obj) ? 'Array' : 'Object';
	header.appendChild(typeSpan);

	const buttonGroup = document.createElement('div');
	buttonGroup.className = 'button-group';

	const addButton = document.createElement('button');
	addButton.className = 'primary-button';
	addButton.innerHTML =
		'<svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /><path d="M11 14h6" /><path d="M14 11v6" /></svg>';
	addButton.onclick = (e) => {
		e.stopPropagation();
		addNewItem(nested, Array.isArray(obj));
	};
	buttonGroup.appendChild(addButton);

	const duplicateButton = document.createElement('button');
	duplicateButton.className = 'primary-button';
	duplicateButton.innerHTML =
		'<svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>';
	duplicateButton.onclick = (e) => {
		e.stopPropagation();
		duplicateItem(container, obj);
	};
	buttonGroup.appendChild(duplicateButton);

	const deleteButton = document.createElement('button');
	deleteButton.className = 'danger-button';
	deleteButton.innerHTML =
		'<svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-square-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" /><path d="M9 9l6 6m0 -6l-6 6" /></svg>';
	deleteButton.onclick = (e) => {
		e.stopPropagation();
		if (confirm('Are you sure you want to delete this item?')) {
			container.remove();
			updateNavigationTree();
		}
	};
	buttonGroup.appendChild(deleteButton);

	header.appendChild(buttonGroup);
	container.appendChild(header);

	const nested = document.createElement('div');
	nested.className = 'nested';

	if (obj) {
		if (Array.isArray(obj)) {
			obj.forEach((item, index) => {
				const itemPath = [...path, index];
				if (typeof item === 'object' && item !== null) {
					nested.appendChild(createObjectEditor(item, index.toString(), itemPath));
				} else {
					nested.appendChild(createValueEditor(item, index.toString(), itemPath));
				}
			});
		} else {
			Object.entries(obj).forEach(([k, v]) => {
				const itemPath = [...path, k];
				if (typeof v === 'object' && v !== null) {
					nested.appendChild(createObjectEditor(v, k, itemPath));
				} else {
					nested.appendChild(createValueEditor(v, k, itemPath));
				}
			});
		}
	}

	container.appendChild(nested);

	header.onclick = () => {
		nested.classList.toggle('collapsed');
		collapseIcon.textContent = nested.classList.contains('collapsed') ? '▶' : '▼';
	};

	return container;
}

// Add this new function for duplication
function duplicateItem(element, data) {
	const parent = element.parentNode;
	const newData = JSON.parse(JSON.stringify(data));
	const newElement = createObjectEditor(
		newData,
		Array.isArray(parent) ? parent.children.length.toString() : data.key + '_copy',
		[]
	);
	parent.appendChild(newElement);
	updateNavigationTree();
	showToast('Item duplicated successfully!');
}

function createValueEditor(value, key, path) {
	const container = document.createElement('div');
	container.className = 'value-editor';
	container.setAttribute('data-path', path.join('.'));

	const keyInput = document.createElement('input');
	keyInput.value = key;
	keyInput.placeholder = 'Key';
	keyInput.onchange = updateNavigationTree;
	container.appendChild(keyInput);

	let valueInput;
	if (typeof value === 'boolean') {
		valueInput = document.createElement('select');
		['true', 'false'].forEach((opt) => {
			const option = document.createElement('option');
			option.value = opt;
			option.text = opt;
			option.selected = opt === value.toString();
			valueInput.appendChild(option);
		});
	} else if (typeof value === 'string' && value.includes('\n')) {
		valueInput = document.createElement('textarea');
		valueInput.value = value;
	} else {
		valueInput = document.createElement('input');
		valueInput.value = value !== undefined ? value : '';
		valueInput.placeholder = 'Value';
	}

	valueInput.onchange = updateNavigationTree;
	container.appendChild(valueInput);

	const buttonGroup = document.createElement('div');
	buttonGroup.className = 'button-group';

	// Add duplicate button
	const duplicateButton = document.createElement('button');
	duplicateButton.className = 'primary-button';
	duplicateButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>';
	duplicateButton.onclick = () => {
		const newContainer = createValueEditor(parseValue(valueInput.value), keyInput.value + '_copy', path);
		container.parentNode.insertBefore(newContainer, container.nextSibling);
		updateNavigationTree();
		showToast('Value duplicated successfully!');
	};
	buttonGroup.appendChild(duplicateButton);

	const deleteButton = document.createElement('button');
	deleteButton.className = 'danger-button';
	deleteButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-square-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" /><path d="M9 9l6 6m0 -6l-6 6" /></svg>';
	deleteButton.onclick = () => {
		if (confirm('Are you sure you want to delete this field?')) {
			container.remove();
			updateNavigationTree();
		}
	};
	buttonGroup.appendChild(deleteButton);

	container.appendChild(buttonGroup);
	return container;
}

function addNewItem(parent, isArray) {
	const dialog = document.getElementById('new-item-dialog');
	const keyInput = document.getElementById('new-item-key');
	keyInput.value = '';
	keyInput.disabled = isArray;

	if (isArray) {
		keyInput.value = parent.children.length.toString();
	}

	document.getElementById('new-item-quantity').value = '1';
	dialog.currentParent = parent;
	dialog.isArray = isArray;
	dialog.showModal();
}

function createObjectFromSchema(schema) {
	if (!schema || !schema.type) return null;

	if (schema.type === 'object' && schema.properties) {
		const obj = {};
		Object.entries(schema.properties).forEach(([key, propSchema]) => {
			if (propSchema.type === 'object') {
				obj[key] = createObjectFromSchema(propSchema);
			} else {
				obj[key] = propSchema.default;
			}
		});
		return obj;
	} else {
		return schema.default;
	}
}

function confirmAddNewItem() {
	const dialog = document.getElementById('new-item-dialog');
	const parent = dialog.currentParent;
	const isArray = dialog.isArray;
	const key = document.getElementById('new-item-key').value;
	const type = document.getElementById('new-item-type').value;
	const quantity = parseInt(document.getElementById('new-item-quantity').value) || 1;

	if (!key && !isArray) {
		showToast('Please enter a key name', 'error');
		return;
	}

	for (let i = 0; i < quantity; i++) {
		let currentKey = isArray ? parent.children.length.toString() : quantity === 1 ? key : `${key}_${i + 1}`;

		// Check if we're using a predefined schema
		if (type.startsWith('schema_')) {
			const schemaName = type.replace('schema_', '');
			const schema = PREDEFINED_SCHEMAS[schemaName];

			if (schema) {
				const newObj = createObjectFromSchema(schema);
				parent.appendChild(createObjectEditor(newObj, currentKey, []));
			}
		} else {
			let value;
			switch (type.toLowerCase()) {
				case 'string':
					value = '';
					parent.appendChild(createValueEditor(value, currentKey, []));
					break;
				case 'number':
					value = 0;
					parent.appendChild(createValueEditor(value, currentKey, []));
					break;
				case 'boolean':
					value = false;
					parent.appendChild(createValueEditor(value, currentKey, []));
					break;
				case 'object':
					value = {};
					parent.appendChild(createObjectEditor(value, currentKey, []));
					break;
				case 'array':
					value = [];
					parent.appendChild(createObjectEditor(value, currentKey, []));
					break;
			}
		}
	}

	updateNavigationTree();
	showToast(`${quantity} new item(s) added successfully!`);
	dialog.close();
}
