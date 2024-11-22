function exportData() {
	try {
		const exportedData = {};
		const rootEditor = document.querySelector('.object-editor');
		processNode(rootEditor, exportedData);

		const output = JSON.stringify(exportedData, null, 2);
		const blob = new Blob([output], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'map_database.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		showToast('Data exported successfully!');
	} catch (error) {
		showToast('Error exporting data: ' + error.message, 'error');
		console.error(error);
	}
}
