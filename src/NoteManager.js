// Note Manager Class
class NoteManager {
	constructor(map) {
		this.map = map;
		this.noteLayer = L.layerGroup().addTo(map);
		this.currentMarker = null;
		this._initializeElements();
		this._initializeEventListeners();
	}

	_initializeElements() {
		this.noteForm = document.getElementById('note-form');
		this.noteContent = document.getElementById('note-content');
		this.saveNoteButton = document.getElementById('save-note');
		this.cancelNoteButton = document.getElementById('cancel-note');
	}

	_initializeEventListeners() {
		this.map.on('click', this._showNoteForm.bind(this));
		this.saveNoteButton.addEventListener('click', this._saveNote.bind(this));
		this.cancelNoteButton.addEventListener('click', this._hideNoteForm.bind(this));
	}

	_showNoteForm(e) {
		this.noteForm.style.display = 'block';
		this.currentMarker = e.latlng;
	}

	_hideNoteForm() {
		this.noteForm.style.display = 'none';
		this.noteContent.value = '';
		this.currentMarker = null;
	}

	_saveNote(e) {
		e.preventDefault();
		if (!this.currentMarker) return;

		const note = {
			id: Date.now(),
			content: this.noteContent.value,
			lat: this.currentMarker.lat,
			lng: this.currentMarker.lng,
		};

		this._saveNoteToLocalStorage(note);
		this._addNoteToMap(note);
		this._hideNoteForm();
	}

	_saveNoteToLocalStorage(note) {
		let notes = this._getNotes();
		notes.push(note);
		localStorage.setItem('mapNotes', JSON.stringify(notes));
	}

	_getNotes() {
		return JSON.parse(localStorage.getItem('mapNotes')) || [];
	}

	_addNoteToMap(note) {
		const marker = L.marker([note.lat, note.lng]).addTo(this.noteLayer);
		const popupContent = `
        <div>
          ${note.content}
          <button class="delete-note" data-note-id="${note.id}">×</button>
        </div>
      `;
		marker.bindPopup(popupContent);

		marker.on('popupopen', () => {
			const deleteButton = document.querySelector(`.delete-note[data-note-id="${note.id}"]`);
			if (deleteButton) {
				deleteButton.addEventListener('click', () => this._deleteNote(note.id, marker));
			}
		});
	}

	_deleteNote(noteId, marker) {
		let notes = this._getNotes().filter((note) => note.id !== noteId);
		localStorage.setItem('mapNotes', JSON.stringify(notes));
		this.noteLayer.removeLayer(marker);
	}

	loadNotes() {
		this._getNotes().forEach((note) => this._addNoteToMap(note));
	}
}
