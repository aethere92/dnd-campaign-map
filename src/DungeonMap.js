// Constants
const ORIGINAL_IMAGE_WIDTH = 13458;
const ORIGINAL_IMAGE_HEIGHT = 6961;
const MAX_ZOOM = 5;
const IS_DEBUG = false;

// Map initialization
const map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: MAX_ZOOM,
	zoomSnap: 1,
});

const bounds = new L.LatLngBounds(map.unproject([0, ORIGINAL_IMAGE_HEIGHT], MAX_ZOOM), map.unproject([ORIGINAL_IMAGE_WIDTH, 0], MAX_ZOOM));

map.setMaxBounds(bounds).fitBounds(bounds);

// Custom tile layer
L.TileLayer.CustomTileLayer = L.TileLayer.extend({
	getTileUrl: function (coords) {
		const zoom = this._getZoomForUrl();
		const tileBounds = this._tileCoordsToBounds(coords);
		const nw = this._map.project(tileBounds.getNorthWest(), zoom);
		const tileSize = this.getTileSize();

		const x = Math.floor(nw.x / tileSize.x);
		const y = Math.floor(nw.y / tileSize.y);

		return L.Util.template(this._url, {
			s: this._getSubdomain(coords),
			x: x,
			y: y,
			z: zoom,
		});
	},
});

L.tileLayer.customTileLayer = (templateUrl, options) => new L.TileLayer.CustomTileLayer(templateUrl, options);

L.tileLayer
	.customTileLayer('tiles/{z}/{x}_{y}.png', {
		minZoom: 0,
		maxZoom: MAX_ZOOM,
		noWrap: true,
		bounds: bounds,
		attribution: "A quest, a questin' we shall go",
	})
	.addTo(map);

// Coordinate display
const coordinatesDiv = document.getElementById('coordinates');
const updateCoordinates = (e) => {
	const { lat, lng } = e.latlng;
	coordinatesDiv.textContent = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
};

map.on('mousemove', updateCoordinates);
map.on('click', updateCoordinates);

// Note-taking functionality
const noteForm = document.getElementById('note-form');
const noteContent = document.getElementById('note-content');
const saveNoteButton = document.getElementById('save-note');
const cancelNoteButton = document.getElementById('cancel-note');
let currentMarker = null;

const noteLayer = L.layerGroup().addTo(map);

const showNoteForm = (e) => {
	noteForm.style.display = 'block';
	currentMarker = e.latlng;
};

const hideNoteForm = () => {
	noteForm.style.display = 'none';
	noteContent.value = '';
	currentMarker = null;
};

const saveNote = (e) => {
	e.preventDefault();
	if (!currentMarker) return;

	const note = {
		id: Date.now(),
		content: noteContent.value,
		lat: currentMarker.lat,
		lng: currentMarker.lng,
	};

	let notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes.push(note);
	localStorage.setItem('mapNotes', JSON.stringify(notes));

	addNoteToMap(note);
	hideNoteForm();
};

const addNoteToMap = (note) => {
	const marker = L.marker([note.lat, note.lng]).addTo(noteLayer);
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
			deleteButton.addEventListener('click', () => deleteNote(note.id, marker));
		}
	});
};

const deleteNote = (noteId, marker) => {
	let notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes = notes.filter((note) => note.id !== noteId);
	localStorage.setItem('mapNotes', JSON.stringify(notes));
	noteLayer.removeLayer(marker);
};

const loadNotes = () => {
	const notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes.forEach(addNoteToMap);
};

// Uncomment these lines to enable note-taking functionality
// map.on('click', showNoteForm);
// saveNoteButton.addEventListener('click', saveNote);
// cancelNoteButton.addEventListener('click', hideNoteForm);
// loadNotes();

// Debug mode
if (IS_DEBUG) {
	map.on('click', (e) => {
		const label = prompt('Please enter a label for this location:');
		if (label !== null) {
			const iconType = e.originalEvent.shiftKey ? 'user' : 'mapPin';
			const placeType = e.originalEvent.shiftKey ? 'people' : 'place';

			const output = JSON.stringify({
				lat: e.latlng.lat,
				lng: e.latlng.lng,
				label: label,
				type: placeType,
				icon: iconType,
			});

			console.log(output);
			navigator.clipboard
				.writeText(output)
				.then(() => console.log('Output copied to clipboard!'))
				.catch((err) => console.error('Failed to copy output: ', err));
		} else {
			console.log('Label input was canceled.');
		}
	});
}
