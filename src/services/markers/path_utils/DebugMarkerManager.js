class MarkerManager {
	constructor(map, isDebugMode, iconsPath = 'images/custom-icons/') {
		if (!map) {
			throw new Error('Map is required for MarkerManager');
		}
		this.map = map;
		this.isDebugMode = isDebugMode;
		this.markers = [];
		this.iconsPath = iconsPath;
		this.currentPolygon = null;
		this.polygonPoints = [];
		this.polylineManager = new PolylineManager(map);

		setTimeout(() => {
			this._initializeGeoman();
			this._setupMarkerCreateHandler();
			this._setupPolygonCreateHandler();
		}, 100);
	}

	_initializeGeoman() {
		this.map.pm.addControls({
			position: 'topleft',
			drawMarker: true,
			drawCircleMarker: false,
			drawPolygon: true,
			drawRectangle: false,
			drawCircle: false,
			editMode: false,
			dragMode: false,
			cutPolygon: false,
			removalMode: false,
		});

		if (!this.isDebugMode) {
			this.map.pm.removeControls();
		}
	}

	_setupMarkerCreateHandler() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Marker') {
				const marker = e.marker;
				const position = marker.getLatLng();

				// Remove the temporary marker
				this.map.removeLayer(marker);

				// Initialize and open modal only when needed
				this._initializeModal();
				this._openModal(position);
			}
		});
	}

	_setupPolygonCreateHandler() {
		this.map.on('pm:create', (e) => {
			if (e.shape === 'Polygon') {
				const polygon = e.layer;
				// Get coordinates and ensure they're in the correct format
				const coordinates = polygon.getLatLngs()[0].map((latLng) => {
					// Round to 6 decimal places for precision
					const lat = parseFloat(latLng.lat.toFixed(6));
					const lng = parseFloat(latLng.lng.toFixed(6));
					return [lat, lng]; // Note: we return [lng, lat] to match the desired format
				});

				// Remove the temporary polygon
				this.map.removeLayer(polygon);

				// Initialize and open polygon modal
				this._initializePolygonModal();
				this._openPolygonModal(coordinates);
			}
		});
	}

	_initializePolygonModal() {
		const existingModal = document.getElementById('debug-polygon-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modalHtml = `
            <div id="debug-polygon-modal" class="marker-modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3 class="debug__polygon-modal--title">Polygon Properties</h2>
                    <form id="debug-polygon-form">
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-name">Name:</label>
                            <input type="text" id="debug-polygon-modal-name" name="debug-polygon-modal-name" required>
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-rotation">Text Rotation:</label>
                            <input type="number" id="debug-polygon-modal-text-rotation" name="debug-polygon-modal-text-rotation" value="0">
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-size">Text Size:</label>
                            <input type="number" id="debug-polygon-modal-text-size" name="debug-polygon-modal-text-size" value="16">
                        </div>
                        <div class="debug__polygon-modal--column">
                            <label for="debug-polygon-modal-text-font-type">Font Type:</label>
                            <select id="debug-polygon-modal-text-font-type" name="debug-polygon-modal-text-font-type">
                                <option value="title">Title</option>
                                <option value="description">Description</option>
                            </select>
                        </div>
						<div class="debug__polygon-modal--row">
							<div class="debug__polygon-modal--column" style="width: 30%;">
								<label for="debug-polygon-modal-line-color">Line Color:</label>
								<input type="color" id="debug-polygon-modal-line-color" name="debug-polygon-modal-line-color">
							</div>
							<div class="debug__polygon-modal--column">
								<label for="debug-polygon-modal-interior-color">Interior Color:</label>
								<div class="debug__polygon-modal--row">
									<input type="color" id="debug-polygon-modal-interior-color" name="debug-polygon-modal-interior-color" value="#E2B203">
									<input type="range" id="debug-polygon-modal-interior-color-opacity" name="opacity" min="0" max="100" value="40">
									<span id="debug-polygon-modal-interior-color-opacity-value">40%</span>
								</div>
							</div>
						</div>
						<div class="debug__polygon-modal--row">
							<button class="debug__polygon-modal--action" type="submit">Save</button>
                        	<button class="debug__polygon-modal--action" type="button" id="debug-polygon-modal-copy-json">Copy to Clipboard</button>
						</div>
                    </form>
                    <div id="debug-polygon-modal-json-preview" style="display: none;">
                        <pre></pre>
                    </div>
                </div>
            </div>
        `;

		document.body.insertAdjacentHTML('beforeend', modalHtml);
		this._initializePolygonModalEvents();
	}

	_initializePolygonModalEvents() {
		const modal = document.getElementById('debug-polygon-modal');
		const form = document.getElementById('debug-polygon-form');
		const closeBtn = modal.querySelector('.close');
		const copyBtn = document.getElementById('debug-polygon-modal-copy-json');
		const opacitySlider = document.getElementById('debug-polygon-modal-interior-color-opacity');
		const opacityValue = document.getElementById('debug-polygon-modal-interior-color-opacity-value');

		opacitySlider.addEventListener('input', (e) => {
			opacityValue.textContent = `${e.target.value}%`;
		});

		closeBtn.onclick = () => (modal.style.display = 'none');

		window.onclick = (e) => {
			if (e.target === modal) modal.style.display = 'none';
		};

		form.onsubmit = (e) => {
			e.preventDefault();
			const polygonData = this._getPolygonFormData();
			this._updatePolygonJsonPreview(polygonData);
		};

		copyBtn.onclick = () => {
			const polygonData = this._getPolygonFormData();
			const jsonString = JSON.stringify(polygonData, null, 2);
			navigator.clipboard
				.writeText(jsonString)
				.then(() => alert('Polygon data copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};
	}

	_getPolygonFormData() {
		const opacity = document.getElementById('debug-polygon-modal-interior-color-opacity').value;
		const interiorColor = this._getRGBAColor(
			document.getElementById('debug-polygon-modal-interior-color').value,
			opacity
		);

		return {
			name: document.getElementById('debug-polygon-modal-name').value,
			textRotation: `${document.getElementById('debug-polygon-modal-text-rotation').value}deg`,
			textSize: parseInt(document.getElementById('debug-polygon-modal-text-size').value),
			textFontType: document.getElementById('debug-polygon-modal-text-font-type').value,
			lineColor: document.getElementById('debug-polygon-modal-line-color').value || null,
			interiorColor,
			points: this.currentPolygonPoints.map((coord) => ({
				coordinates: coord,
			})),
		};
	}

	_getRGBAColor(hex, opacity) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgb(${r} ${g} ${b} / ${opacity}%)`;
	}

	_openPolygonModal(coordinates) {
		this.currentPolygonPoints = coordinates;
		const modal = document.getElementById('debug-polygon-modal');
		modal.style.display = 'block';
	}

	_updatePolygonJsonPreview(data) {
		const jsonPreview = document.getElementById('debug-polygon-modal-json-preview');
		jsonPreview.style.display = 'block';
		jsonPreview.querySelector('pre').textContent = JSON.stringify(data, null, 2);
	}

	_initializeModal() {
		const existingModal = document.getElementById('debug-marker-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modalHtml = `
            <div id="debug-marker-modal" class="marker-modal">
                <div class="modal-content">
                    <span class="close" style="">&times;</span>
                    <h2>Add Marker</h2>
                    <form id="debug-marker-modal-form">
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-lat">Latitude:</label>
                            <input type="number" id="debug-marker-modal-lat" name="debug-marker-modal-lat" step="any" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-lng">Longitude:</label>
                            <input type="number" id="debug-marker-modal-lng" name="debug-marker-modal-lng" step="any" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-label">Label:</label>
                            <input type="text" id="debug-marker-modal-label" name="debug-marker-modal-label" required>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-type">Type:</label>
                            <select id="debug-marker-modal-type" name="debug-marker-modal-type" required>
                                <option value="people">People</option>
                                <option value="place">Place</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div class="marker-form-item">
                            <div id="debug-marker-modal-icon-preview" style="margin-top: 5px; text-align: center; min-height: 24px;">
                                <!-- Icon preview will be shown here -->
                            </div>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-icon-type">Icon Type:</label>
                            <select id="debug-marker-modal-icon-type" name="debug-marker-modal-icon-type" required>
                                <option value="png">PNG</option>
                                <option value="svg">SVG</option>
                            </select>
                        </div>
                        <div class="marker-form-item">
                            <label for="debug-marker-modal-map-link">Map Link:</label>
                            <input type="text" id="debug-marker-modal-map-link" name="debug-marker-modal-map-link">
                        </div>
                        <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 0.25rem;">Save</button>
                        <button type="button" id="debug-marker-modal-copy-json" style="background-color: #008CBA; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 0.25rem;">Copy JSON</button>
                    </form>
                    <div id="debug-marker-modal-json-preview" style="margin-top: 15px; padding: 10px; background-color: #f5f5f5; display: none;">
                        <pre style="margin: 0; white-space: pre-wrap;"></pre>
                    </div>
                </div>
            </div>
        `;

		const modalContainer = document.createElement('div');
		modalContainer.innerHTML = modalHtml;
		document.body.appendChild(modalContainer.firstElementChild);

		this.modal = document.getElementById('debug-marker-modal');
		this.form = document.getElementById('debug-marker-modal-form');
		this.closeBtn = this.modal.querySelector('.close');
		this.copyBtn = document.getElementById('debug-marker-modal-copy-json');
		this.jsonPreview = document.getElementById('debug-marker-modal-json-preview');

		// Fetch and populate icons
		this._fetchIcons();

		this._initializeModalEvents();
	}

	async _fetchIcons() {
		try {
			// Fetch the icons.json file that contains the list of available icons
			const response = await fetch(`${this.iconsPath}icons.json`);
			if (!response.ok) {
				throw new Error('Failed to fetch icons list');
			}

			const icons = await response.json();
			const iconPreview = document.getElementById('debug-marker-modal-icon-preview');

			const noneOption = document.createElement('span');
			noneOption.textContent = 'None';
			noneOption.className = 'debug__marker-modal--icon-text';
			noneOption.title = 'No icon';

			noneOption.onclick = (event) => {
				this._selectImageOption(event.target);
			};
			iconPreview.append(noneOption);

			icons.forEach((icon) => {
				const img = document.createElement('img');
				img.src = `${this.iconsPath}${icon.id}.png`;
				img.style.maxHeight = '40px';
				img.className = 'debug__marker-modal--icon';
				img.title = icon.id;
				img.dataset.iconId = icon.id;
				iconPreview.appendChild(img);

				img.onclick = (event) => {
					this._selectImageOption(event.target);
				};
			});
		} catch (error) {
			console.error('Error loading icons:', error);
			// Fallback to a basic set of icons if the fetch fails
			const fallbackIcons = ['tradeForge', 'inn', 'shop', 'temple'];
			const iconSelect = document.getElementById('debug-marker-modal-icon');

			fallbackIcons.forEach((icon) => {
				const option = document.createElement('option');
				option.value = icon;
				option.textContent = icon;
				iconSelect.appendChild(option);
			});
		}
	}

	_selectImageOption(target) {
		if (!target) return;
		const elements = this.modal
			.querySelectorAll('.debug__marker-modal--icon, .debug__marker-modal--icon-text')
			.forEach((item) => {
				item.classList.remove('icon-selected');
			});

		target.classList.add('icon-selected');
	}

	_initializeModalEvents() {
		// Close modal when clicking X
		this.closeBtn.onclick = () => {
			this._closeModal();
		};

		// Close modal when clicking outside
		window.onclick = (event) => {
			if (event.target === this.modal) {
				this._closeModal();
			}
		};

		// Handle form submission
		this.form.onsubmit = (e) => {
			e.preventDefault();
			const markerData = this._getFormData();
			this.markers.push(markerData);
			this._updateJsonPreview(markerData);
		};

		// Handle copy button
		this.copyBtn.onclick = () => {
			const markerData = this._getFormData();
			const jsonString = this._formatMarkerJson(markerData);
			navigator.clipboard
				.writeText(jsonString)
				.then(() => alert('JSON copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};
	}

	_openModal(position) {
		this.modal.style.display = 'block';
		document.getElementById('debug-marker-modal-lat').value = position.lat.toFixed(6);
		document.getElementById('debug-marker-modal-lng').value = position.lng.toFixed(6);
		this.jsonPreview.style.display = 'none';
	}

	_closeModal() {
		this.modal.style.display = 'none';
		this.form.reset();
	}

	_getFormData() {
		const selectedIcon = document?.querySelector('.debug__marker-modal--icon.icon-selected')?.dataset?.iconId;
		return {
			lat: parseFloat(document.getElementById('debug-marker-modal-lat').value),
			lng: parseFloat(document.getElementById('debug-marker-modal-lng').value),
			label: document.getElementById('debug-marker-modal-label').value,
			type: document.getElementById('debug-marker-modal-type').value,
			icon: selectedIcon && selectedIcon !== undefined ? selectedIcon : null,
			iconType: document.getElementById('debug-marker-modal-icon-type').value,
			mapLink: document.getElementById('debug-marker-modal-map-link').value || undefined,
		};
	}

	_formatMarkerJson(data) {
		// Remove undefined properties
		Object.keys(data).forEach((key) => {
			if (data[key] === undefined) {
				delete data[key];
			}
		});
		return JSON.stringify(data, null, 2);
	}

	_updateJsonPreview(data) {
		const jsonString = this._formatMarkerJson(data);
		this.jsonPreview.style.display = 'block';
		this.jsonPreview.querySelector('pre').textContent = jsonString;
	}

	// Export all markers
	exportMarkers() {
		return JSON.stringify(this.markers, null, 2);
	}
}
