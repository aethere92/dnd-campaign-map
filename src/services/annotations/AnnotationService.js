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

	async _addPointsToLayer(categoryKey, points, categoryName) {
		points.forEach((point) => {
			const icon = this._getIcon(point.icon, point.iconColor, point.iconType);
			const marker = this._createMarker(point, icon, categoryKey, categoryName);
			marker.addTo(this.layers[categoryName]);
			this.markers.push(marker);
		});
	}

	async _createMarker(point, icon, categoryKey, categoryName) {
		if (!icon) {
			// Use default Leaflet icon if no custom icon is provided
			const defaultIcon = L.icon({
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41],
			});
			return this._createMarkerWithIcon(point, defaultIcon, categoryKey, categoryName);
		}
		return this._createMarkerWithIcon(point, icon, categoryKey, categoryName);
	}

	_createMarkerWithIcon(point, icon, categoryKey, categoryName) {
		// Create a new icon instance with the label
		const labeledIcon = point.icon ? this._createLabeledIcon(icon, point.label) : null;

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

			const icon = new L.DivIcon({
				className: 'myDivIcon',
				html: `<span class="custom-marker-text">${point.label}</span>`,
			});

			if (point.icon) {
				marker = L.marker([point.lat, point.lng], { icon: point.type === 'text' ? icon : labeledIcon }).bindPopup(
					label
				);
			} else {
				const customIcon = L.icon({
					iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // URL of the default marker icon
					iconSize: [15, 22.5], // Size of the icon (width, height)
					iconAnchor: [7.5, 22.5], // Anchor point of the icon (half of the width, full height)
					popupAnchor: [0, -22.5], // Offset of the popup relative to the icon
				});

				// Use the custom icon when creating the marker
				marker = L.marker([point.lat, point.lng], { icon: customIcon }).bindPopup(label);
			}
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
		// If no icon name provided, return null or a default icon
		if (!iconName) {
			return Promise.resolve(null);
		}

		const cacheKey = `${iconName}-${iconColor}`;
		if (this.iconCache[cacheKey]) return this.iconCache[cacheKey];

		if (!iconType || iconType === 'png') {
			// Create a temporary image to get natural dimensions
			const img = new Image();
			img.src = `images/custom-icons/${iconName}.png`;

			return new Promise((resolve) => {
				img.onload = () => {
					const icon = L.icon({
						iconUrl: `images/custom-icons/${iconName}.png`,
						shadowUrl: 'images/custom-icons/shadow.png',
						iconSize: [img.width / 3, img.height / 3],
						shadowSize: [img.width / 3, img.height / 3],
						iconAnchor: [img.width / 5, img.height / 3], // Center bottom
						shadowAnchor: [img.width / 5, img.height / 3], // Center bottom
						popupAnchor: [0, -img.height / 3], // Center top
					});

					this.iconCache[cacheKey] = icon;
					resolve(icon);
				};

				img.onerror = () => {
					// If image fails to load, resolve with null or a default icon
					resolve(null);
				};
			});
		} else if (iconType === 'svg') {
			const iconContent = `
                <div class="custom-marker-icon">
                    ${SVG_ICON_DB[iconName]}
                </div>`;

			const icon = L.divIcon({
				className: 'marker',
				html: iconContent,
				iconSize: [25, 41], // Default size for SVG
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
			});

			this.iconCache[cacheKey] = icon;
			return Promise.resolve(icon);
		}
	}

	async _addPointsToLayer(categoryKey, points, categoryName) {
		for (const point of points) {
			const icon = await this._getIcon(point.icon, point.iconColor, point.iconType);
			const marker = await this._createMarker(point, icon, categoryKey, categoryName);
			marker.addTo(this.layers[categoryName]);
			this.markers.push(marker);
		}
	}

	_createLabeledIcon(baseIcon, label) {
		if (baseIcon instanceof L.DivIcon) {
			// Handle div icons (SVG)
			const baseIconHtml = baseIcon.options.html;
			const temp = document.createElement('div');
			temp.innerHTML = baseIconHtml;

			const iconDiv = temp.querySelector('.custom-marker-icon');
			if (iconDiv) {
				iconDiv.setAttribute('data-label', label || '');
			}

			return L.divIcon({
				...baseIcon.options,
				html: temp.innerHTML,
			});
		} else {
			// For regular icons (PNG), return as is since we can't modify the icon directly
			return baseIcon;
		}
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
