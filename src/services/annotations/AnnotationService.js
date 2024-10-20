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

		Object.entries(annotationsData).forEach(([categoryKey, category]) => {
			this.layers[category.name] = L.layerGroup();
			this._addPointsToLayer(categoryKey, category.items, category.name);
			this.layers[category.name].addTo(this.map);
		});

		if (Object.keys(this.layers).length > 0) {
			// Store the layer control in the CustomMap instance
			this.map.layerControl = L.control.layers(null, this.layers).addTo(this.map);

			const layerControlContainer = this.map.layerControl.getContainer();
			if (layerControlContainer) {
				layerControlContainer.classList.add('layer-group-pois');
			}
		}
	}

	clearLayers() {
		Object.values(this.layers).forEach((layer) => {
			this.map.removeLayer(layer);
		});
		this.layers = {};
		this.markers = [];
	}

	_addPointsToLayer(categoryKey, points, categoryName) {
		points.forEach((point) => {
			const icon = this._getIcon(point.icon, point.iconColor, point.iconType);
			const marker = this._createMarker(point, icon, categoryKey, categoryName);
			marker.addTo(this.layers[categoryName]);
			this.markers.push(marker);
		});
	}

	_createMarker(point, icon, categoryKey, categoryName) {
		// Create a new icon instance with the label
		const labeledIcon = this._createLabeledIcon(icon, point.label);

		let label;
		let marker;

		const image = point.image ? `<img class="label-image" src="images/assets/${point.image}" width="200"/>` : '';
		const description = point.description ? `<span class="label-description">${point.description}</span>` : '';
		const mapLink = point.mapLink
			? `<button onclick="customMap.loadMap('${point.mapLink}')" class="map-button">Go to map</button>`
			: '';

		if (categoryKey === 'landmarks') {
			label = `
				<div class="sidebar-content">
					<span class="label-title">${point.label}</span>
					<span class="label-separator"></span>
					<div class="label-container-body">
						${image}
						${description}
					</div>
					<span class="label-separator"></span>
					${mapLink}
				</div>
			`;

			marker = L.marker([point.lat, point.lng], { icon: labeledIcon });

			marker.on('click', (e) => {
				this._openSidebar(label);
				L.DomEvent.stopPropagation(e);
			});
		} else {
			label = `<div class='label-container'>
				<span class="label-title">${point.label}</span>
				<div class="label-container-body">
					${image}
					${description}
				</div>
					${mapLink}
			</div>`;

			marker = L.marker([point.lat, point.lng], { icon: labeledIcon }).bindPopup(label);
		}

		marker.on('add', () => {
			const markerElement = marker.getElement();
			if (markerElement) {
				markerElement.classList.add('custom-marker-class');
				markerElement.setAttribute('data-category', categoryKey);
				markerElement.setAttribute('data-category-name', categoryName);
				markerElement.setAttribute('data-label', point.label);

				if (point.mapLink) {
					markerElement.classList.add('has-map');
				}
			}
		});

		return marker;
	}

	_openSidebar(content) {
		let sidebar = document.getElementById('landmark-sidebar');
		if (!sidebar) {
			sidebar = document.createElement('div');
			sidebar.id = 'landmark-sidebar';
			sidebar.className = 'landmark-sidebar';
			document.body.appendChild(sidebar);

			const closeButton = document.createElement('button');
			closeButton.textContent = 'Close';
			closeButton.className = 'sidebar-close';
			closeButton.onclick = () => this._closeSidebar();
			sidebar.appendChild(closeButton);

			const contentDiv = document.createElement('div');
			contentDiv.className = 'sidebar-inner-content';
			sidebar.appendChild(contentDiv);
		}

		const contentDiv = sidebar.querySelector('.sidebar-inner-content');
		contentDiv.innerHTML = content;
		sidebar.style.left = '0';
	}

	_closeSidebar() {
		const sidebar = document.getElementById('landmark-sidebar');
		if (sidebar) {
			sidebar.style.left = '-400px';
		}
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

		// Check for category name filter
		if (filterCriteria.categoryName) {
			const markerCategoryName = markerElement.getAttribute('data-category-name');
			matches = matches && markerCategoryName === filterCriteria.categoryName;
		}

		// Check for label filter
		if (filterCriteria.label) {
			const markerLabel = markerElement.getAttribute('data-label');
			matches = matches && markerLabel.includes(filterCriteria.label);
		}

		return matches;
	}
}
