document.addEventListener('DOMContentLoaded', () => {
	const customMap = new CustomMap('map');
	customMap.addTileLayer();

	// const noteManager = new NoteManager(customMap.map);
	// noteManager.loadNotes();

	const annotationManager = new AnnotationService(customMap.map);
	if (typeof MAP_DATA !== 'undefined') {
		annotationManager.addAnnotations(MAP_DATA);
	}
});
