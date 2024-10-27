class AnnotationService {
	constructor(map) {
		this.map = map;
		this.iconCache = {};
		this.layers = {};
		this.markers = [];
	}

	// Main public methods
	addAnnotations(annotationsData) {
		this.clearLayers();

		Object.entries(annotationsData).forEach(([categoryKey, category]) => {
			this.layers[category.name] = L.layerGroup();
			this._addPointsToLayer(categoryKey, category.items, category.name);
			this.layers[category.name].addTo(this.map);
		});

		if (Object.keys(this.layers).length > 0) {
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

	getMarkers(map = this.map, filterCriteria = {}) {
		if (!map) return [];

		if (this.markers.length > 0) {
			return this.markers.filter((marker) => this._matchesCriteria(marker, filterCriteria));
		}

		let mapMarkers = [];

		if (map._layers) {
			Object.keys(map._layers).forEach((layerId) => {
				const layer = map._layers[layerId];
				if (layer instanceof L.LayerGroup) {
					layer.getLayers().forEach((marker) => {
						if (marker instanceof L.Marker) {
							mapMarkers.push(marker);
						}
					});
				}
			});
		}

		return mapMarkers.filter((marker) => this._matchesCriteria(marker, filterCriteria));
	}

	// Layer and marker creation methods
	async _addPointsToLayer(categoryKey, points, categoryName) {
		for (const point of points) {
			const icon = await this._getIcon(point.icon, point.iconColor, point.iconType);
			const marker = await this._createMarker(point, icon, categoryKey, categoryName);
			marker.addTo(this.layers[categoryName]);
			this.markers.push(marker);
		}
	}

	_getIcon(iconName, iconColor, iconType) {
		if (!iconName) {
			return Promise.resolve(null);
		}

		const cacheKey = `${iconName}-${iconColor}`;
		if (this.iconCache[cacheKey]) return this.iconCache[cacheKey];

		if (!iconType || iconType === 'png') {
			return new Promise((resolve) => {
				// Load the image first to get dimensions
				const tempImg = new Image();
				tempImg.src = `images/custom-icons/${iconName}.png`;

				tempImg.onload = () => {
					// Calculate dimensions based on original image
					const width = tempImg.width / 2.5;
					const height = tempImg.height / 2.5;

					const div = document.createElement('div');
					div.className = 'custom-icon-container';

					// Set container size to match calculated dimensions
					div.style.width = `${width}px`;
					div.style.height = `${height}px`;

					// Create inner div for pseudo-element targeting
					const innerDiv = document.createElement('div');
					innerDiv.className = 'custom-icon-image';
					innerDiv.style.backgroundImage = `url(images/custom-icons/${iconName}.png)`;

					// Add shadow div
					const shadowDiv = document.createElement('div');
					shadowDiv.className = 'custom-icon-shadow';
					shadowDiv.style.backgroundImage = 'url(images/custom-icons/shadow.png)';

					div.appendChild(shadowDiv);
					div.appendChild(innerDiv);

					const icon = L.divIcon({
						className: 'custom-marker',
						html: div.outerHTML,
						iconSize: [width, height],
						shadowSize: [width, height],
						iconAnchor: [width / 2, height],
						shadowAnchor: [width / 2, height],
						popupAnchor: [0, -height],
					});

					this.iconCache[cacheKey] = icon;
					resolve(icon);
				};

				tempImg.onerror = () => {
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
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
			});

			this.iconCache[cacheKey] = icon;
			return Promise.resolve(icon);
		}
	}

	async _createMarker(point, icon, categoryKey, categoryName) {
		const image = point.image ? `<img class="label-image" src="images/assets/${point.image}" width="200"/>` : '';
		const description = point.description ? `<span class="label-description">${point.description}</span>` : '';
		const mapLink = point.mapLink
			? `<button onclick="customMap.loadMap('${point.mapLink}')" class="map-button">Go to map</button>`
			: '';

		let label;
		let marker;

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

			marker = L.marker([point.lat, point.lng], {
				icon: icon || this._createDefaultIcon(),
			});

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

			const textIcon = new L.DivIcon({
				className: 'myDivIcon',
				html: `<span class="custom-marker-text">${point.label}</span>`,
			});

			marker = L.marker([point.lat, point.lng], {
				icon: point.type === 'text' ? textIcon : icon || this._createDefaultIcon(),
			}).bindPopup(label);
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

	// Helper methods
	_createDefaultIcon() {
		return L.divIcon({
			className: 'default-marker',
			html: '<div class="default-marker-inner"></div>',
			iconSize: [15, 22.5],
			iconAnchor: [7.5, 22.5],
			popupAnchor: [0, -22.5],
		});
	}

	_matchesCriteria(marker, filterCriteria) {
		const markerElement = marker.getElement();
		if (!markerElement) return false;

		let matches = true;

		if (filterCriteria.category) {
			const markerCategory = markerElement.getAttribute('data-category');
			matches = matches && markerCategory === filterCriteria.category;
		}

		if (filterCriteria.categoryName) {
			const markerCategoryName = markerElement.getAttribute('data-category-name');
			matches = matches && markerCategoryName === filterCriteria.categoryName;
		}

		if (filterCriteria.label) {
			const markerLabel = markerElement.getAttribute('data-label');
			matches = matches && markerLabel.includes(filterCriteria.label);
		}

		return matches;
	}

	// Sidebar methods
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
}
