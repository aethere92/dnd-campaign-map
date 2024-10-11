class AnnotationService {
	constructor(map) {
		this.map = map;
		this.iconCache = {};
		this.layers = {};
		this.markers = [];
	}

	addAnnotations(annotationsData) {
		// Clear existing layers and markers
		this.clearLayers();

		Object.entries(annotationsData).forEach(([category, points]) => {
			this.layers[category] = L.layerGroup();
			this._addPointsToLayer(category, points);
			this.layers[category].addTo(this.map);
		});

		if (Object.keys(this.layers).length > 0) {
			// Store the layer control in the CustomMap instance
			this.map.layerControl = L.control.layers(null, this.layers).addTo(this.map);
		}
	}

	clearLayers() {
		Object.values(this.layers).forEach((layer) => {
			this.map.removeLayer(layer);
		});
		this.layers = {};
		this.markers = [];
	}

	addMapLinkToMarker(annotation) {
		const marker = this.markers.find((m) => m.getLatLng().lat === annotation.lat && m.getLatLng().lng === annotation.lng);

		if (marker) {
			const originalPopupContent = marker.getPopup().getContent();
			const linkButton = `<button onclick="customMap.loadMap('${annotation.mapLink}')" 
                                       class="map-button">
                                  Go to map
                               </button>`;

			marker.bindPopup(originalPopupContent + linkButton);
		}
	}

	_addPointsToLayer(category, points) {
		points.forEach((point) => {
			const icon = this._getIcon(point.icon, point.iconColor, point.iconType);
			const marker = this._createMarker(point, icon, category);
			marker.addTo(this.layers[category]);
			this.markers.push(marker);
		});
	}

	_createMarker(point, icon, category) {
		// Create a new icon instance with the label
		const labeledIcon = this._createLabeledIcon(icon, point.label);

		const image = point.image ? `<img class="label-image" src="images/assets/${point.image}" width="200"/>` : '';
		const description = point.description ? `<span class="label-description">${point.description}</span>` : '';
		const mapLink = point.mapLink ? `<button onclick="customMap.loadMap('${point.mapLink}')" class="map-button">Go to map</button>` : '';

		const label = `<div class='label-container'>
				<span class="label-title">${point.label}</span>
				<div class="label-container-body">
					${image}
					${description}
				</div>
					${mapLink}
			</div>`;

		const marker = L.marker([point.lat, point.lng], { icon: labeledIcon }).bindPopup(label);

		marker.on('add', () => {
			const markerElement = marker.getElement();
			if (markerElement) {
				markerElement.classList.add('custom-marker-class');
				markerElement.setAttribute('data-category', category);
				markerElement.setAttribute('data-label', point.label);

				if (point.mapLink) {
					markerElement.classList.add('has-map');
				}
			}
		});

		return marker;
	}

	_getIcon(iconName, iconColor, iconType) {
		const cacheKey = `${iconName}-${iconColor}`;
		if (this.iconCache[cacheKey]) return this.iconCache[cacheKey];

		let iconContent;
		if (!iconType || iconType === 'png') {
			iconContent = `
                <div class="custom-marker-icon">
                    <img width="24px" src="images/custom-icons/${iconName}.png" />
                </div>`;
		} else if (iconType === 'svg') {
			iconContent = `
                <div class="custom-marker-icon">
                    ${SVG_ICON_DB[iconName]}
                </div>`;
		}

		const icon = L.divIcon({
			className: 'marker',
			html: iconContent,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
		});

		this.iconCache[cacheKey] = icon;
		return icon;
	}

	_createLabeledIcon(baseIcon, label) {
		// Create a new icon instance
		const baseIconHtml = baseIcon.options.html;

		// Parse the HTML string to a temporary element
		const temp = document.createElement('div');
		temp.innerHTML = baseIconHtml;

		// Find the custom-marker-icon div and add the data-label attribute
		const iconDiv = temp.querySelector('.custom-marker-icon');
		if (iconDiv) {
			iconDiv.setAttribute('data-label', label || '');
		}

		// Create a new icon with the updated HTML
		return L.divIcon({
			...baseIcon.options,
			html: temp.innerHTML,
		});
	}

	getMarkers(map = this.map, filterCriteria = {}) {
		// If no map is passed and no local map is available, return an empty array
		if (!map) return [];

		// If there are markers in the local array, return them
		if (this.markers.length > 0) {
			return this.markers.filter((marker) => this._matchesCriteria(marker, filterCriteria));
		}

		// If no local markers exist, retrieve markers from the passed map or local map
		let mapMarkers = [];

		// Check if map is a Leaflet map object
		if (map._layers) {
			// Iterate through each layer on the map
			Object.keys(map._layers).forEach((layerId) => {
				const layer = map._layers[layerId];
				if (layer instanceof L.LayerGroup) {
					// Filter markers within the layer group
					layer.getLayers().forEach((marker) => {
						if (marker instanceof L.Marker) {
							mapMarkers.push(marker);
						}
					});
				}
			});
		}

		// Filter retrieved markers based on criteria
		return mapMarkers.filter((marker) => this._matchesCriteria(marker, filterCriteria));
	}

	// Helper method to check if a marker matches the given criteria
	_matchesCriteria(marker, filterCriteria) {
		const markerElement = marker.getElement();
		if (!markerElement) return false; // Skip if marker element is not available

		let matches = true;

		// Check for category filter
		if (filterCriteria.category) {
			const markerCategory = markerElement.getAttribute('data-category');
			matches = matches && markerCategory === filterCriteria.category;
		}

		// Check for label filter
		if (filterCriteria.label) {
			const markerLabel = markerElement.getAttribute('data-label');
			matches = matches && markerLabel.includes(filterCriteria.label);
		}

		return matches;
	}
}
