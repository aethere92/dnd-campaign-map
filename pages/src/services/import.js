// Enhanced import functionality
function importFromText() {
	const jsonInput = document.getElementById('json-input').value;
	try {
		let data;
		try {
			data = JSON.parse(jsonInput);
		} catch {
			const cleanedInput = jsonInput.replace(/^(?:const|let|var)\s+[^=]+=\s*/, '');
			data = eval('(' + cleanedInput + ')');
		}

		if (typeof data === 'object') {
			if ('world_maps' in data) {
				MAP_DATABASE = data;
			} else {
				MAP_DATABASE = data.MAP_DATABASE || data;
			}
			initEditor();
			document.getElementById('json-input').value = '';
			document.getElementById('import-dialog').close();
			showToast('Data imported successfully!');
		} else {
			throw new Error('Invalid data structure');
		}
	} catch (error) {
		showToast('Error importing data: ' + error.message, 'error');
	}
}

function importFromFile(input) {
	const file = input.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			document.getElementById('json-input').value = e.target.result;
			importFromText();
		};
		reader.readAsText(file);
	}
}
