class AnnotationService {
	static DEFAULT_ICON_SIZES = {
		width: 15,
		height: 22.5,
	};

	static ICON_TYPES = {
		PNG: 'png',
		SVG: 'svg',
	};

	constructor(map) {
		this.map = map;
		this.iconCache = new Map();
		this.layers = new Map();
		this.markers = [];
		this.maxIconWidth = 50;
	}

	addAnnotations(annotationsData) {
		this.clearLayers();

		for (const [categoryKey, category] of Object.entries(annotationsData)) {
			const layerGroup = L.layerGroup();
			this.layers.set(category.name, layerGroup);
			this._addPointsToLayer(categoryKey, category.items, category.name);
			layerGroup.addTo(this.map);
		}

		if (this.layers.size > 0) {
			this._initializeLayerControl();
		}
	}

	clearLayers() {
		for (const layer of this.layers.values()) {
			this.map.removeLayer(layer);
		}
		this.layers.clear();
		this.markers = [];
	}

	getMarkers(map = this.map, filterCriteria = {}) {
		if (!map) return [];

		if (this.markers.length > 0) {
			return this.markers.filter((marker) => this._matchesCriteria(marker, filterCriteria));
		}

		return this._getAllMapMarkers(map).filter((marker) => this._matchesCriteria(marker, filterCriteria));
	}

	_getAllMapMarkers(map) {
		const mapMarkers = [];

		if (map._layers) {
			Object.values(map._layers).forEach((layer) => {
				if (layer instanceof L.LayerGroup) {
					layer.getLayers().forEach((marker) => {
						if (marker instanceof L.Marker) {
							mapMarkers.push(marker);
						}
					});
				}
			});
		}

		return mapMarkers;
	}

	async _addPointsToLayer(categoryKey, points, categoryName) {
		const layerGroup = this.layers.get(categoryName);

		await Promise.all(
			points.map(async (point) => {
				const icon = await this._getIcon(point.icon, point.iconColor, point.iconType);
				const marker = await this._createMarker(point, icon, categoryKey, categoryName);
				marker.addTo(layerGroup);
				this.markers.push(marker);
			})
		);
	}

	async _getIcon(iconName, iconColor, iconType) {
		if (!iconName) return null;

		const cacheKey = `${iconName}-${iconColor}`;
		if (this.iconCache.has(cacheKey)) return this.iconCache.get(cacheKey);

		const icon =
			iconType === AnnotationService.ICON_TYPES.SVG
				? await this._createSvgIcon(iconName)
				: await this._createPngIcon(iconName);

		if (icon) this.iconCache.set(cacheKey, icon);
		return icon;
	}

	_loadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve({ width: img.width, height: img.height });
			img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
			img.src = src;
		});
	}

	_calculateIconDimensions({ width, height }) {
		let calculatedWidth = width / 2;
		let calculatedHeight = height / 2;

		if (calculatedWidth > this.maxIconWidth) {
			const aspectRatio = calculatedHeight / calculatedWidth;
			calculatedWidth = this.maxIconWidth;
			calculatedHeight = Math.round(calculatedWidth * aspectRatio);
		}

		return { width: calculatedWidth, height: calculatedHeight };
	}

	_createIconHtml(iconName, width, height) {
		return `
            <div class="custom-icon-container" style="width:${width}px;height:${height}px">
                <img class="custom-icon-image" src="images/custom-icons/${iconName}.png">
            </div>
        `;
	}

	async _createPngIcon(iconName) {
		try {
			const dimensions = await this._loadImage(`images/custom-icons/${iconName}.png`);
			const { width, height } = this._calculateIconDimensions(dimensions);

			const iconHtml = this._createIconHtml(iconName, width, height);

			return L.divIcon({
				className: 'custom-marker-icon',
				html: iconHtml,
				iconSize: [width, height],
				shadowSize: [width, height],
				iconAnchor: [width / 2, height],
				shadowAnchor: [width / 2, height],
				popupAnchor: [0, -height],
			});
		} catch (error) {
			console.error('Error creating PNG icon:', error);
			return null;
		}
	}

	_createSvgIcon(iconName) {
		const iconContent = `
            <div class="custom-marker-icon">
                ${SVG_ICON_DB[iconName]}
            </div>`;

		return L.divIcon({
			className: 'marker',
			html: iconContent,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
		});
	}

	async _createMarker(point, icon, categoryKey, categoryName) {
		const labeledIcon = point.icon
			? this._createLabeledIcon(icon, point.label, Boolean(point.mapLink), point.icon)
			: null;

		const markerContent = this._createMarkerContent(point);
		const marker = this._initializeMarker(point, labeledIcon, categoryKey, markerContent);

		this._attachMarkerEvents(marker, point, categoryKey, categoryName);

		return marker;
	}

	_createMarkerContent(point) {
		const image = point.image ? `<img class="label-image" src="images/assets/${point.image}" width="200"/>` : '';
		const description = point.description ? `<span class="label-description">${point.description}</span>` : '';
		const mapLink = point.mapLink
			? `<button onclick="customMap.loadMap('${point.mapLink}')" class="map-button">View map</button>`
			: '';

		return {
			image,
			description,
			mapLink,
			label: point.label,
		};
	}

	_initializeMarker(point, labeledIcon, categoryKey, content) {
		const isLandmark = categoryKey === 'landmarks';
		const markerOptions = {
			icon: point.type === 'text' ? this._createTextIcon(point) : labeledIcon || this._createDefaultIcon(),
		};

		const marker = L.marker([point.lat, point.lng], markerOptions);

		if (isLandmark) {
			this._setupLandmarkMarker(marker, content);
		} else {
			this._setupRegularMarker(marker, content);
		}

		return marker;
	}

	_createTextIcon(point) {
		return new L.DivIcon({
			className: 'myDivIcon',
			html: `<span class="custom-marker-text" style="${point.fontSize ? `font-size: ${point.fontSize}pt` : ''}">${
				point.label
			}</span>`,
		});
	}

	_createDefaultIcon() {
		const { width, height } = AnnotationService.DEFAULT_ICON_SIZES;
		return L.divIcon({
			className: 'default-marker',
			html: '<div class="default-marker-inner"></div>',
			iconSize: [width, height],
			iconAnchor: [width / 2, height],
			popupAnchor: [0, -height],
		});
	}

	_createLabeledIcon(baseIcon, label) {
		const temp = document.createElement('div');
		temp.innerHTML = baseIcon.options.html;

		const iconDiv = temp.querySelector('.custom-icon-image');
		if (iconDiv) {
			iconDiv.setAttribute('data-label', label || '');
		}

		const containerDiv = temp.querySelector('.custom-icon-container');
		if (containerDiv) {
			containerDiv.setAttribute('data-tooltip', label || '');
		}

		return L.divIcon({
			...baseIcon.options,
			html: temp.innerHTML,
		});
	}

	_setupLandmarkMarker(marker, content) {
		const sidebarContent = this._createSidebarContent(content);

		marker.bindTooltip(content.label, {
			permanent: false,
			direction: 'top',
			className: 'custom-tooltip',
		});

		marker.on('click', (e) => {
			this._openSidebar(sidebarContent);
			L.DomEvent.stopPropagation(e);
		});
	}

	_setupRegularMarker(marker, content) {
		const popupContent = this._createPopupContent(content);
		marker.bindPopup(popupContent);

		if (marker.options.icon.options.className !== 'myDivIcon') {
			marker.bindTooltip(content.label, {
				permanent: false,
				direction: 'top',
				className: 'custom-tooltip',
			});
		}
	}

	_attachMarkerEvents(marker, point, categoryKey, categoryName) {
		marker.on('add', () => {
			const element = marker.getElement();
			if (element) {
				element.classList.add('custom-marker-class');
				element.setAttribute('data-category', categoryKey);
				element.setAttribute('data-category-name', categoryName);
				element.setAttribute('data-label', point.label);
				element.setAttribute('data-url', this._generateMarkerUrl(point, categoryKey));

				if (point.mapLink) {
					element.classList.add('has-map');
				}
			}
		});

		marker.on('popupopen', (e) => {
			const element = marker.getElement();
			const popupContent = e.popup.getContent();

			// Create a temporary DOM parser to find the button
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = popupContent;

			const urlButton = tempDiv.querySelector('.label-marker-anchor');
			if (urlButton) {
				// Remove any existing listeners to prevent multiple bindings
				urlButton.removeEventListener('click', this._handleUrlButtonClick);

				// Create a bound method to preserve 'this' context
				this._handleUrlButtonClick = (event) => {
					event.preventDefault(); // Prevent default link behavior
					this._showMarkerUrl(element);
				};

				// Clone the button from the popup to add the listener
				const actualButton = e.popup._contentNode.querySelector('.label-marker-anchor');
				if (actualButton) {
					actualButton.addEventListener('click', this._handleUrlButtonClick);
				} else {
					console.error('Actual button not found in popup');
				}
			} else {
				console.error('No URL button found in popup content');
			}
		});
	}

	_showMarkerUrl(element) {
		if (!element) return;
		const url = element.dataset.url;
		prompt('Marker link', url);
	}

	_generateMarkerUrl(point, categoryKey) {
		// Generate a unique URL for the marker based on its properties
		const mapKey = this.map.customMap.getCurrentMapKey();
		const targetId = `marker:${categoryKey}.${point.label.toLowerCase().replace(/\s+/g, '_')}:${point.lat},${
			point.lng
		}`;
		return `${window.location.origin}${window.location.pathname}?map=${mapKey}&t=${targetId}`;
	}

	_createSidebarContent({ label, image, description, mapLink }) {
		return `
            <div class="sidebar-content">
                <span class="label-title">${label}</span>
                <span class="label-separator"></span>
                <div class="label-container-body">
                    ${image}
                    ${description}
                </div>
                <span class="label-separator"></span>
                ${mapLink}
            </div>
        `;
	}

	_createPopupContent({ label, image, description, mapLink }) {
		return `
            <div class='label-container'>
                <div class="marker-label-container">
					<button class="label-marker-anchor" title="Link to this marker">🔗</button>
                    <span class="label-title">${label}</span>
                </div>
                <div class="label-container-body">
                    ${image}
                    ${description}
                </div>
                ${mapLink}
            </div>
        `;
	}

	_matchesCriteria(marker, filterCriteria) {
		const element = marker.getElement();
		if (!element) return false;

		const criteria = {
			category: () => element.getAttribute('data-category') === filterCriteria.category,
			categoryName: () => element.getAttribute('data-category-name') === filterCriteria.categoryName,
			label: () => element.getAttribute('data-label').includes(filterCriteria.label),
		};

		return Object.entries(filterCriteria).every(([key, value]) => !value || (criteria[key] && criteria[key]()));
	}

	_openSidebar(content) {
		let sidebar = document.getElementById('landmark-sidebar');
		if (!sidebar) {
			sidebar = this._createSidebar();
		}

		const contentDiv = sidebar.querySelector('.sidebar-inner-content');
		contentDiv.innerHTML = content;
		sidebar.style.left = '0';
	}

	_createSidebar() {
		const sidebar = document.createElement('div');
		sidebar.id = 'landmark-sidebar';
		sidebar.className = 'landmark-sidebar';

		const closeButton = document.createElement('button');
		closeButton.textContent = 'Close';
		closeButton.className = 'sidebar-close';
		closeButton.onclick = () => this._closeSidebar();

		const contentDiv = document.createElement('div');
		contentDiv.className = 'sidebar-inner-content';

		sidebar.appendChild(closeButton);
		sidebar.appendChild(contentDiv);
		document.body.appendChild(sidebar);

		return sidebar;
	}

	_closeSidebar() {
		const sidebar = document.getElementById('landmark-sidebar');
		if (sidebar) {
			sidebar.style.left = '-400px';
		}
	}

	_initializeLayerControl() {
		// Add each layer to the markers category
		Array.from(this.layers.entries()).forEach(([name, layer]) => {
			this.map.customMap.updateLayerGroup('markers', `📍 ${name}`, layer);
		});
	}

	focusMarker(target) {
		if (!target) return;

		// Wait a bit to ensure markers are fully loaded
		setTimeout(() => {
			const marker = this.markers.find((m) => {
				const element = m.getElement();
				return (
					element &&
					element.getAttribute('data-category') === target.category &&
					element.getAttribute('data-label') === target.label
				);
			});

			if (marker) {
				// Make sure the marker's layer is visible
				const layerGroup = this.layers.get(target.categoryName);
				if (layerGroup) {
					layerGroup.addTo(this.map);
				}

				// Open tooltip and popup if available
				if (marker.options.icon.options.className !== 'myDivIcon') {
					marker.openTooltip();
				}
				if (marker.getPopup()) {
					marker.openPopup();
				}
			}
		}, 100);
	}
}
