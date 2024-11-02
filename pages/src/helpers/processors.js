function processNode(element, target) {
	if (!element || !element.querySelector('.nested')) return;

	const nested = element.querySelector('.nested');
	const children = nested.children;

	if (Array.isArray(target)) {
		let index = 0;
		for (const child of children) {
			if (child.className === 'value-editor') {
				const valueInput = child.querySelector('input, textarea, select');
				target[index] = parseValue(valueInput.value);
				index++;
			} else if (child.className === 'object-editor') {
				const type = child.querySelector('.type').textContent;
				target[index] = type === 'Array' ? [] : {};
				processNode(child, target[index]);
				index++;
			}
		}
		target.length = index;
	} else {
		for (const child of children) {
			if (child.className === 'value-editor') {
				const [keyInput, valueInput] = child.querySelectorAll('input, textarea, select');
				target[keyInput.value] = parseValue(valueInput.value);
			} else if (child.className === 'object-editor') {
				const key = child.querySelector('.key').textContent;
				const type = child.querySelector('.type').textContent;
				target[key] = type === 'Array' ? [] : {};
				processNode(child, target[key]);
			}
		}
	}
}

function parseValue(value) {
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'null') return null;

	// Check if the value is a number (integer or decimal)
	const num = Number(value);
	if (!isNaN(num)) return num;

	// Try to parse as JSON if it starts with `{` or `[`
	try {
		if (value.startsWith('{') || value.startsWith('[')) {
			return JSON.parse(value);
		}
	} catch (error) {
		console.error('JSON parsing error:', error);
	}

	// Return as a string if none of the above
	return value;
}
