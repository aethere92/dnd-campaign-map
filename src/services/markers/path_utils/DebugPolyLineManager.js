class PolylineManager {
	constructor(map) {
		this.map = map;
		this.currentPolyline = null;
		this.points = [];
		this.texts = {};
		this.isDrawing = false;
		this.initializeControls();
	}

	initializeControls() {
		// Handle drawing start
		this.map.on('pm:drawstart', (e) => {
			if (e.shape === 'Line') {
				this.isDrawing = true;
				this.points = [];
				this.texts = {};
				this.currentPolyline = e.workingLayer;

				// Add click handler for the map while drawing
				this.map.on('click', this.handleMapClick.bind(this));
			}
		});

		// Handle drawing end
		this.map.on('pm:drawend', (e) => {
			if (this.isDrawing) {
				this.isDrawing = false;
				this.map.off('click', this.handleMapClick.bind(this));
				if (this.points.length > 0) {
					this.openPolylineModal();
				}
			}
		});
	}

	handleMapClick(e) {
		if (!this.isDrawing) return;

		const latLng = e.latlng;
		const coordinates = [latLng.lat, latLng.lng];

		// Add point to our array
		const pointIndex = this.points.length;
		this.points.push({
			coordinates: coordinates,
		});

		// If shift key is pressed, open text input modal
		if (e.originalEvent.shiftKey) {
			this.openTextInputModal(pointIndex);
		}
	}

	openTextInputModal(pointIndex) {
		const modal = document.createElement('div');
		modal.className = 'debug__line-text-modal';
		modal.innerHTML = `
            <h4 class="debug__line-text-modal--title">Add text for point ${pointIndex + 1}</h3>
            <textarea 
                id="debug-line-text-input" 
                rows="4" 
				class="debug__line-text-modal--textarea"
                placeholder="Enter description for this point..."></textarea>
			<div class="debug__line-text-modal--actions">
				<input id="debug-line-wait-input" type="number" placeholder="Wait timer"/>
				<select id="debug-line-wait-type">
					<option value="null">None</option>
					<option value="fight">⚔️</option>
					<option value="merchant">💰</option>
					<option value="rest">💤</option>
					<option value="conversation">💬</option>
					<option value="loot">💎</option>
					<option value="walk">👣</option>
					<option value="question">❓</option>
				</select>
			</div>
			<div class="debug__line-text-modal--actions">
				<select id="debug-line-filter-type">
					<option value="N/A">No filter</option>
					<option value="null">Remove filter</option>
					<option value="night">Night</option>
					<option value="night-half">Night 50%</option>
					<option value="dusk">Dusk</option>
					<option value="snow">Snow</option>
					<option value="rain">Rain</option>					
					<option value="fog">Fog</option>					
				</select>
			</div>
            <div class="debug__line-text-modal--actions">
                <button class="debug__line-text-modal--action" id="debug-line-text-cancel" style="margin-left: auto; background: #E2B203; color: black;">Cancel</button>
                <button class="debug__line-text-modal--action" id="debug-line-text-save" style="background: #22A06B; color: white;">Save</button>
            </div>
        `;

		document.body.appendChild(modal);

		// Handle save
		document.getElementById('debug-line-text-save').onclick = () => {
			const text = document.getElementById('debug-line-text-input').value;
			const waitTimer = document.getElementById('debug-line-wait-input').value;
			const waitType = document.getElementById('debug-line-wait-type').value;
			const filterType = document.getElementById('debug-line-filter-type').value;

			if (text) {
				this.points[pointIndex].text = text;
			}

			if (waitTimer) {
				this.points[pointIndex].animationInfo = this.points[pointIndex].animationInfo || {};
				this.points[pointIndex].animationInfo.waitTimer = parseInt(waitTimer);
			}

			if (waitType) {
				if (!waitTimer && waitType == 'null') {
				} else {
					this.points[pointIndex].animationInfo = this.points[pointIndex].animationInfo || {};
					this.points[pointIndex].animationInfo.animationType = waitType;
				}
			}

			if (filterType !== 'N/A') {
				this.points[pointIndex].filter = filterType;
			}

			modal.remove();
		};

		// Handle cancel
		document.getElementById('debug-line-text-cancel').onclick = () => {
			modal.remove();
		};
	}

	openPolylineModal() {
		const modal = document.createElement('div');
		modal.className = 'debug__line-modal';

		modal.innerHTML = `
            <h3 class="debug__line-modal--title">Polyline Properties</h3>
            <div class="debug__line-modal--row">
                <label>Name:</label>
                <input type="text" id="debug-line-name" value="New Polyline">
            </div>
            <div class="debug__line-modal--row">
                <label>Line Color:</label>
                <div style="display: flex; gap: 0.25rem;">
                    <input type="color" id="lineColorPicker" value="#2898BD" style="width: 50px;">
                    <input type="text" id="lineColor" style="width: calc(100% - 50px);" value="#2898BD">
                </div>
            </div>
            <div class="debug__line-modal--row">
                <label>Preview:</label>
                <pre id="debug-line-json-preview"></pre>
            </div>
            <div class="debug__line-modal--row">
                <button id="debug-line-copy" class="debug__line-modal--action">Copy to Clipboard</button>
            </div>
        `;

		// Add backdrop
		const backdrop = document.createElement('div');
		backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;

		document.body.appendChild(backdrop);
		document.body.appendChild(modal);

		// Handle color picker changes
		const colorPicker = document.getElementById('lineColorPicker');
		const colorInput = document.getElementById('lineColor');

		colorPicker.addEventListener('input', (e) => {
			const color = e.target.value.toUpperCase();
			colorInput.value = color;
			this.updatePreview();
			if (this.currentPolyline) {
				this.currentPolyline.setStyle({ color: color });
			}
		});

		colorInput.addEventListener('input', (e) => {
			colorPicker.value = e.target.value;
			this.updatePreview();
			if (this.currentPolyline) {
				this.currentPolyline.setStyle({ color: e.target.value });
			}
		});

		// Handle name input changes
		document.getElementById('debug-line-name').addEventListener('input', () => {
			this.updatePreview();
		});

		// Initial preview update
		this.updatePreview();

		// Handle copy button
		document.getElementById('debug-line-copy').onclick = () => {
			const polylineData = this.getPolylineData();
			navigator.clipboard
				.writeText(JSON.stringify(polylineData, null, 2))
				.then(() => alert('Copied to clipboard!'))
				.catch((err) => console.error('Failed to copy:', err));
		};

		// Close on backdrop click
		backdrop.onclick = () => {
			modal.remove();
			backdrop.remove();
		};
	}

	updatePreview() {
		const previewElement = document.getElementById('debug-line-json-preview');
		if (previewElement) {
			const data = this.getPolylineData();
			previewElement.textContent = JSON.stringify(data, null, 2);
		}
	}

	getPolylineData() {
		return {
			name: document.getElementById('debug-line-name').value || 'New Polyline',
			lineColor: document.getElementById('lineColor').value,
			points: this.points.map((point) => {
				const pointData = {
					coordinates: point.coordinates,
				};
				if (point.text) {
					pointData.text = point.text;
				}
				if (point.animationInfo && point.animationInfo.waitTimer) {
					pointData.animationInfo = pointData.animationInfo || {};
					pointData.animationInfo.waitTimer = point.animationInfo.waitTimer;
				}
				if (point.animationInfo && point.animationInfo.animationType) {
					pointData.animationInfo = pointData.animationInfo || {};
					pointData.animationInfo.animationType = point.animationInfo.animationType;
				}

				if (point.filter) {
					pointData.filter = point.filter;
				}

				return pointData;
			}),
		};
	}
}
