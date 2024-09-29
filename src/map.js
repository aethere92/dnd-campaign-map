const originalImageWidth = 13458;
const originalImageHeight = 6961;
const maxZoom = 5;

const map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: maxZoom,
});

const southWest = map.unproject([0, originalImageHeight], maxZoom);
const northEast = map.unproject([originalImageWidth, 0], maxZoom);
const bounds = new L.LatLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.fitBounds(bounds);

L.TileLayer.CustomTileLayer = L.TileLayer.extend({
	getTileUrl: function (coords) {
		const zoom = this._getZoomForUrl();
		const tileBounds = this._tileCoordsToBounds(coords);
		const nw = this._map.project(tileBounds.getNorthWest(), zoom);
		const se = this._map.project(tileBounds.getSouthEast(), zoom);
		const tileWidth = se.x - nw.x;
		const tileHeight = se.y - nw.y;

		const x = Math.floor(nw.x / tileWidth);
		const y = Math.floor(nw.y / tileHeight);

		return L.Util.template(
			this._url,
			L.extend(
				{
					s: this._getSubdomain(coords),
					x: x,
					y: y,
					z: zoom,
				},
				this.options
			)
		);
	},
});

L.tileLayer.customTileLayer = function (templateUrl, options) {
	return new L.TileLayer.CustomTileLayer(templateUrl, options);
};

L.tileLayer
	.customTileLayer('tiles/{z}/{x}_{y}.png', {
		minZoom: 0,
		maxZoom: maxZoom,
		noWrap: true,
		bounds: bounds,
		attribution: "A quest, a questin' we shall go",
	})
	.addTo(map);

L.setOptions(map, {
	zoomSnap: 1,
});

// Coordinate display functionality
const coordinatesDiv = document.getElementById('coordinates');

function updateCoordinates(e) {
	const { lat, lng } = e.latlng;
	coordinatesDiv.textContent = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
}

map.on('mousemove', updateCoordinates);
map.on('click', updateCoordinates); // For mobile devices

// Note-taking functionality
const noteForm = document.getElementById('note-form');
const noteContent = document.getElementById('note-content');
const saveNoteButton = document.getElementById('save-note');
const cancelNoteButton = document.getElementById('cancel-note');
let currentMarker = null;

function showNoteForm(e) {
	noteForm.style.display = 'block';
	currentMarker = e.latlng;
}

function hideNoteForm() {
	noteForm.style.display = 'none';
	noteContent.value = '';
	currentMarker = null;
}

function saveNote(e) {
	e.preventDefault();
	if (!currentMarker) return;

	const note = {
		id: Date.now(), // Use timestamp as a unique identifier
		content: noteContent.value,
		lat: currentMarker.lat,
		lng: currentMarker.lng,
	};

	let notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes.push(note);
	localStorage.setItem('mapNotes', JSON.stringify(notes));

	addNoteToMap(note);
	hideNoteForm();
}

function addNoteToMap(note) {
	const marker = L.marker([note.lat, note.lng]).addTo(map);
	const popupContent = `
        <div>
            ${note.content}
            <button class="delete-note" data-note-id="${note.id}">×</button>
        </div>
    `;
	marker.bindPopup(popupContent);

	marker.on('popupopen', function () {
		const deleteButton = document.querySelector(`.delete-note[data-note-id="${note.id}"]`);
		if (deleteButton) {
			deleteButton.addEventListener('click', function () {
				deleteNote(note.id, marker);
			});
		}
	});
}

function deleteNote(noteId, marker) {
	let notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes = notes.filter((note) => note.id !== noteId);
	localStorage.setItem('mapNotes', JSON.stringify(notes));
	map.removeLayer(marker);
}

function loadNotes() {
	const notes = JSON.parse(localStorage.getItem('mapNotes')) || [];
	notes.forEach(addNoteToMap);
}

// map.on('click', showNoteForm);
// saveNoteButton.addEventListener('click', saveNote);
// cancelNoteButton.addEventListener('click', hideNoteForm);

// loadNotes();
